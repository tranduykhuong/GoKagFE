
![Logo](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/GOKag.png?alt=media)


# GoKag (Front-end) - Datasets and Surveys

## Introduction
GoKag is an Ultimate Datasets and Surveys Management Platform.

At GoKag, we empower individuals, researchers, and organizations to harness the power of data and insights like never before. We understand the critical role that datasets and surveys play in shaping decisions, driving innovation, and fueling progress. That's why we've created a dedicated platform to simplify and streamline every aspect of dataset and survey management.



## Demo

You can perform live demo here. [Live Demo](https://data.gokag.id.vn/).


## Screenshots

- Landing page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-10-34.png?alt=media)

- Login page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-11-42.png?alt=media)
- Register page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-11-49.png?alt=media)

- Datasets page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-13-52.png?alt=media)

- Datasets detail page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-15-58.png?alt=media)

- Visualize page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-17-02.png?alt=media)

- Surveys page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-22-15.png?alt=media)

- Forn answer page
  ![App Screenshot](https://firebasestorage.googleapis.com/v0/b/gokag-19eac.appspot.com/o/Screenshot%20from%202023-09-26%2011-24-17.png?alt=media)


## Table of Contents

- [Tech Stack](#techstack)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Run Locally](#run-)
- [Development](#development)
- [Acknowledgements](#acknowledgements)
- [License](#license)


## Tech Stack

- ReactJS
- SASS module
- Redux toolkit
- Recoil
- Eslint
- ChartJS 2
- Tinymce
- Onesignal
- Moment

## Features

1. Authentication
- Register by email
- Verify email
- Login
- JWT with Access Token and Refresh Token

2. Datasets
- Create datasets through excel files or from surveys
- Update dataset's information
- Like/Share dataset to social media
- Download dataset by xlsx
- Search/Filter/Tags
- Realtime notification when anyone likes your dataset

3. Visualize
- Display data as a table
- Visualize datasets into statistical charts

4. Surveys
- Create a set of questions to conduct surveys via forms (add, copy, delete, arrangement)
- Automatically create question sets through analyzing excel files
- Send survey for people to fill out
- Search/Filter/Pagination

5. User profile
- Update personal information
- Update avatar
- Manage your own datasets and surveys


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_API_TINY`

`REACT_APP_API_ENDPOINT`

`REACT_APP_DOMAIN`


## Run Locally

Clone the project

```bash
  git clone https://github.com/lucqng111/GoKagFE.git
```

Go to the project directory

```bash
  cd GoKagFE
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## Development

To run program in product environment:

- docker and docker-compose
- git

1. Clone the reposity:

```bash
    git clone git clone https://github.com/lucqng111/GoKagFE.git
```

2. From within the repository directory, run:

```bash
    docker-compose up --build
```

## Acknowledgements

 - [ReactJS](https://react.dev/)
 - [Onesignal](https://onesignal.com/)
 - [Docker](https://www.docker.com/)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Support

For support, email joseph.tran.goldenowl@gmail.com or join our Slack channel.
