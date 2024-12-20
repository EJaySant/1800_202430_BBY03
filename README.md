# Project Title
Findr

## 1. Project Description
This browser based web application allows users to post lost items they find and enables others
to find their lost items. 

After authentication, the user will be directed to the main page where they can browse, search, and get 
the location of their lost items. Users that encounter a lost item will be able to post a picture of that 
item along with its location, name, description, and time when it was found.

## 2. Contributors
* Ervin Santiago
* Carl Manansala
* Tushar Aheer
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* MediaStream API
* Geolocation API
* FileReader API
* Icons - FLATICON: https://www.flaticon.com/
* Background Image - OnlyGFX.com: https://www.onlygfx.com/grey-triangle-pattern-seamless-background-jpg/
* Landing Page Image - iStock: https://www.istockphoto.com/photo/lost-wallet-on-empty-bench-gm592382744-101724725

## 4. Complete setup/installion/usage
* Click on this link: https://comp1800-202430-bby03.web.app/
* Create an account
* Enable camera and location on your device while using the page

## 5. Known Bugs and Limitations
* Camera functionality only works as intended on laptop or desktop devices with a camera.
* Location based features will fail to appear or work if location is not enabled.
* Exiting from the posting page or report.html too quickly after submitting a post will result in the post not fully submitting.
* If the camera is not enabled, the user will not be allowed to post a lost item.
* Smaller screen sizes may cause the parts of the pages to clip or not appear.
* User cannot log out of their current session.
* Clicking sumbit quickly during the confirm posts will can create two posts with the same details and image. 

## 6. Features for Future
What we'd like to build in the future:
* Adding direct message between users
* An ai to ensure that the image matches the description given by user
* Adding a filter for searching to be more precise
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # Landing HTML file, this is what users see when they click on the url.
├── login.html               # Login HTML file, this is where users are directed to after pressing the login button.
├── main.html                # Main HTML file, this is where the user is directed to after logging in and where they can access the rest of the web app. 
├── profile.html             # Profile HTML file, this is where users access their account information.
├── report.html              # Report HTML file, this is where user posts lost items.
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /3people-icon.png        # FLATICON: https://www.flaticon.com/
    /Profile Icon.png        # FLATICON: https://www.flaticon.com/
    /add.png                 # FLATICON: https://www.flaticon.com/
    /findr.PNG               # Customized icon made from canva.com
    /home.jpg                # FLATICON: https://www.flaticon.com/
    /lostw.jpg               #https://www.istockphoto.com/photo/lost-wallet-on-empty-bench-gm592382744-101724725
    /mainbackground.jpg      # FLATICON: https://www.flaticon.com/
    /marker.png              # FLATICON: https://www.flaticon.com/
    /search-icon.png         # FLATICON: https://www.flaticon.com/

├── scripts                  # Folder for scripts
    /authentication.js       # Handles the functionality of the authentication of users
    /firebaseAPI_BBY03.js    # Allows us to use firebase and firestore
    /main.js                 # Handles the functionality of the main/browsing page
    /profile.js              # Handles the functionality of the profile page
    /report.js               # Handles the functionilty of the report page
    /script.js               # Signs out the user when they land on the index or login
    /skeleton.js             # Handles functionality for the nav bar and signed-out users

├── styles                   # Folder for styles
    /index.css               # Index page specific styling
    /login.css               # Login page specific styling
    /main.css                # Main page specific styling
    /nav.css                 # Navigation specific styling
    /profile.css             # Profile page specific styling
    /report.css              # Report page specific styling
    /style.css               # Overall website styling



```


