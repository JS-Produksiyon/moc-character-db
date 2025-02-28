# -*- coding: utf-8 -*-
# Timezone aware date utilities
import datetime, pytz


def tzware_datetime():
    """
    Return a timezone aware datetime.

    :return: Datetime
    """
    return datetime.datetime.now(pytz.utc)


def timedelta_months(months, compare_date=None):
    """
    Return a new datetime with a month offset applied.

    :param months: Amount of months to offset
    :type months: int
    :param compare_date: Date to compare at
    :type compare_date: date
    :return: datetime
    """
    if compare_date is None:
        compare_date = datetime.date.today()

    delta = months * 365 / 12
    compare_date_with_delta = compare_date + datetime.timedelta(delta)

    return compare_date_with_delta

def isodate():
    """
    Returns the local date in ISO format 
    
    :return : string
    """
    now = datetime.datetime.now()

    return datetime.date(now.year, now.month, now.day).isoformat()
