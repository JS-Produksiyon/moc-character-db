/* JSON base models */

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
	marital_status: 0,
	acted_by: 0,
	relationships: [
		{
			id: 0,
			name: "", /* full name */
			relation: { id:0, slug: "" }
		}
	],
	episodes: [0,1,2]
}


/* character list object */
char_list = 
[
	{
		id: 0,
		name: "", /* full name */
		sex: "",
		episodes: 0, /* episode count */
		animation_status: 0
	}
]


/* Episode list */
episodes =
[
	{
		id: 0,
		name: "",
		recorded: ""
	}
]

/* Relationship Types object */
rel_types = 
[
    {
        id: 0,
        slug: "",
        name: "",
		reciprocal_male : "",
		reciprocal_female: ""
    }
]

/* Residence object */
residence = 
[
    {
        id: 0,
        name: ""
    }
]

/* Actors object */
[
    {
        id: 0,
        name: ""
    }
]
