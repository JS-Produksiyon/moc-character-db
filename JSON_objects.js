/* JSON base models reference document */

/* Character object */
character = 
{
	id: 0,
	first_name: "",
	last_name: "",
	sex: "",
	age: 0,
	physical: "",
	personality: "",
	employment: "",
	image_head: "",
	image_body: "",
	animation_status: 0,
	residence: 0,
	marital_status: "",
	acted_by: 0,
	relationships: [
		{
			id: 0,
			name: "", /* full name */
			sex: "",
			relation: { id:0, slug: "" }
		}
	],
	episodes: [0,1,2]
}


/* character list object */
char_list = 
{
	0: {
		id: 0,
		name: "", /* full name */
		sex: "",
		episodes: 0, /* episode count */
		animation_status: ""
	}
}


/* Episode list */
episodes =
{
	0 : {
			id: 0,
			name: "",
			recorded: "",
			characters: [{ character_id: 0, character_name: "" }]
		}
}

/* Relationship Types object */
rel_types = 
{
    0: {
    	 id: 0,
        slug: "",
        name: "",
		reciprocal_male : "",
		reciprocal_female: ""
    }
}

/* Residence object */
residence = 
{
    0: {
        id: 0,
        name: ""
    }
}

/* Actors object */
actors =
{
    0: {
        id: 0,
        name: ""
    }
}

/* Settings Object */
settings = 
{
	"APP_LANGUAGE" : "",
	"SECRET_KEY" : "",
	"SQLALCHEMY_DATABASE_URI": ""
}