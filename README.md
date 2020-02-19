# toddle_project

Toddle Project 

Api and Param Information

1.) http://classiq.in:3000/api/registeruser
POST API
PARAM : name - String
username - String
password -String

example
request:-

name:vipin
username:vikt
password:123456

response:
{
    "response": true,
    "responseString": "User Added Successfully"
}

2.) http://classiq.in:3000/api/login
POST API
Bsic Autherization
Header- Need to Authentication (username , password);
example
Authorization : Basic dmlrdDoxMjM0NTY=

response:

{
    "response": true,
    "responseString": "Loggedin Successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpa3QiLCJpYXQiOjE1ODIwOTE2MzR9.Z9Ik9geeWhWxSQMQ1gKoiomHa1iUJky5K4fSRmnHo0c"
}

To create Survey
3.) http://classiq.in:3000/api/survey
POST API
param - 
question
option1
option2
token - header
Example

request:

question:Are you ok ?
option1:yes
option2:no

reponse
{
    "response": true,
    "responseString": "Question Added Successfully"
}

Get Survey Question
4.) http://classiq.in:3000/api/get_survey_question
Get API
token - header
{
    "response": true,
    "responseString": "Data fetched Successfully",
    "data": [
        {
            "question_id": "21789627",
            "createdAt": "2020-02-19T06:00:27.132Z",
            "createdBy": "vikt",
            "question": "Human ?",
            "option": [
                "yes",
                "no"
            ]
        }
    ]
}

5.http://classiq.in:3000/api/feedback
POST API
To Submit Feedback 
Param:-

question_id - we will get on the get_survey_question api
option - option 

example

request
question_id:21789627
option:no

response
{
    "response": true,
    "responseString": "Survey Submitted Successfully"
}

6.http://classiq.in:3000/api/survey_result
GET API
TOKEN  -HEADER

EXAMPLE
reponse

{
    "response": true,
    "responseString": "Data fetched Successfully",
    "data": [
        {
            "question_id": "21789627",
            "submittedAt": "2020-02-19T06:00:50.169Z",
            "submittedBy": "vikt",
            "question": "Human ?",
            "option": "no"
        }
    ]
}

7.
http://classiq.in:3000/api/create_thumbnail
To Create Thumbnai 50*50 px
Get API
Query Param - image_url
example
http://classiq.in:3000/api/create_thumbnail?image_url=https://www.toddleapp.com/_next/static/images/landingpage_bg-e0a3c8cee6a48a32406dec8b3a279f8a.png

response:
{"response":true,"responseString":"Thumbnail Created Successfully","thumbnail_url":"classiq.in/resize03497613.png"}























