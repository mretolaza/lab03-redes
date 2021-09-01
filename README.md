
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">Routes Table Simulation</h3>

  <p align="center">
   
    <br />
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#implemented-functionalities">Implemented functionalities</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project



### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [Node JS](https://nodejs.org/en/)
* [Simple Node XMPP](https://github.com/simple-xmpp/node-simple-xmpp)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [Chalk](https://www.npmjs.com/package/chalk)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

To be able to use this client locally. You must have the following dependencies installed on your computer

* npm
  ```sh
  npm install npm@latest -g
  ```
* Docker 

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mretolaza/lab03-redes.git
   ```
2. Install NPM packages
   * Move to the folder project 
   ```sh
   npm i
   ```
3. Install docker engine  
  * Move to the folder project 
   ```Prepare server 
   docker run --name ejabberd -v $(pwd)/ejabberd.yml:/home/ejabberd/conf/ejabberd.yml -p 5222:5222 -p 5280:5280 ejabberd/ecs

   docker exec -it ejabberd bin/ejabberdctl register admin alumchat.xyz 12345
   ```

## Run the program 

The client is divided into 6 folders. classes (xmppClient) examples, files, handlers, lib and utilis. The xmppClient file is in charge of managing or requesting each of the functionalities from the server. Each one has its own method that works the xmpp stanzas in xml.

In the Index.js calls are made to the functions that complement the client structure. Then, it is in charge of asking the user for the information and printing the result of the responses from the server in a friendly way.

To start running the program after downloading the dependencies, run:

  ```Mov to the folder project 
       node .  
   ```
   
To start executing the program after downloading dependencies run:

<!-- LICENSE -->
## License

- https://github.com/mretolaza/chat-xmpp-protocol/blob/c6c4682cd248fc75636197ef0df3b16f11fdd188/LICENSE


<!-- CONTACT -->
## Contact

María Mercedes Retolaza Reyna - - ret16339@uvg.edu.gt
César Rodas - - 

Project Link: [https://github.com/mretolaza/chat-xmpp-protocol](https://github.com/mretolaza/chat-xmpp-protocol)
