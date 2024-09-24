import datetime

from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, select
from sqlalchemy.types import TypeDecorator

from utils.util_datetime import tzware_datetime
from app.db import db

class AwareDateTime(TypeDecorator):
    """
    A DateTime type which can only store tz-aware DateTimes.

    Source:
      https://gist.github.com/inklesspen/90b554c864b99340747e
    """
    impl = DateTime(timezone=True)

    def process_bind_param(self, value, dialect):
        if isinstance(value, datetime.datetime) and value.tzinfo is None:
            raise ValueError('{!r} must be TZ-aware'.format(value))
        return value

    def __repr__(self):
        return 'AwareDateTime()'


class ResourceMixin(object):
    # Keep track when records are created and updated.
    created_on = db.Column(AwareDateTime(),
                           default=tzware_datetime)
    updated_on = db.Column(AwareDateTime(),
                           default=tzware_datetime,
                           onupdate=tzware_datetime)

    @classmethod
    def sort_by(cls, field, direction):
        """
        Validate the sort field and direction.

        :param field: Field name
        :type field: str
        :param direction: Direction
        :type direction: str
        :return: tuple
        """
        if field not in cls.__table__.columns:
            field = 'created_on'

        if direction not in ('asc', 'desc'):
            direction = 'asc'

        return field, direction

    @classmethod
    def get_bulk_action_ids(cls, scope, ids, omit_ids=[], query=''):
        """
        Determine which IDs are to be modified.

        :param scope: Affect all or only a subset of items
        :type scope: str
        :param ids: List of ids to be modified
        :type ids: list
        :param omit_ids: Remove 1 or more IDs from the list
        :type omit_ids: list
        :param query: Search query (if applicable)
        :type query: str
        :return: list
        """
        omit_ids = map(str, omit_ids)

        if scope == 'all_search_results':
            # Change the scope to go from selected ids to all search results.
            ids = cls.query.with_entities(cls.id).filter(cls.search(query))

            # SQLAlchemy returns back a list of tuples, we want a list of strs.
            ids = [str(item[0]) for item in ids]

        # Remove 1 or more items from the list, this could be useful in spots
        # where you may want to protect the current user from deleting themself
        # when bulk deleting user accounts.
        if omit_ids:
            ids = [id for id in ids if id not in omit_ids]

        return ids

    @classmethod
    def bulk_delete(cls, ids):
        """
        Delete 1 or more model instances.

        :param ids: List of ids to be deleted
        :type ids: list
        :return: Number of deleted instances
        """
        delete_count = cls.query.filter(cls.id.in_(ids)).delete(
            synchronize_session=False)
        db.session.commit()

        return delete_count

    @classmethod
    def commit_multiple(cls):
        rows = len(db.session.new) + len(db.session.dirty)
        db.session.commit()
        return rows


    @classmethod
    def dump_table(cls, confirm=False):
        """
        Dump the entire data in a given table

        :param confirm: confirms whether or not the dump takes plase
        :type  confirm: Boolean
        :return number of deleted instances:
        """
        result = 0

        if confirm:
            result = cls.query.delete()
            db.session.commit()
        
        return result

    

    def multiple(self):
        """
        Add a model instance to be committed later.
        """
        db.session.add(self)

        return self 


    def save(self):
        """
        Save a model instance.

        :return: Model instance
        """
        db.session.add(self)
        db.session.commit()

        return self

    def delete(self):
        """
        Delete a model instance.

        :return: db.session.commit()'s result
        """
        db.session.delete(self)
        return db.session.commit()

    def __str__(self):
        """
        Create a human readable version of a class instance.

        :return: self
        """
        obj_id = hex(id(self))
        columns = self.__table__.c.keys()

        values = ', '.join("%s=%r" % (n, getattr(self, n)) for n in columns)
        return '<%s %s(%s)>' % (obj_id, self.__class__.__name__, values)

# raw category that includes a search function
class MultiLingualTitleTable(ResourceMixin):
    """
    Base object for creating a table with multilingual titles
    Generally used for categories, tags, and genres
    """
    default_title = db.Column('default', db.String(255), nullable=False, comment="Default titles; populated according to default language set on initial setup")
    
    @classmethod 
    def find_by_lang(cls, lang, data):
        """
        Find a category by a given language name

        :param lang: interface language code
        :type  lang: string
        :param cat : category title in selected language
        :type  cat : string
        :returns   : query object or None
        """
        return cls.query.filter(cls.__dict__[lang].like(f'%{data}%')).first()

    @classmethod
    def update(cls, id, fields):
        """
        Update a multilingual table dynamically created language fields

        :param id    : id number of row
        :type  id    : integer
        :param fields: dict containing key : value pairs of fields
        :type  fields: dictionary
        :returns     : boolean
        """
        query_obj = cls.query.filter(cls.id == id).update(fields)
        db.session.commit()
        return query_obj

