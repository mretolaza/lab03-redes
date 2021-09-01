

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h3 align="center">ROUTE TABLE SIMULATION</h3>

  <p align="center">
    A network layer is simulated with routing algorithms that are capable of simulating how packet transfer networks work today on the Internet.

For the program, an interaction with nodes that are previously established in a topology is simulated. The program reads them and you must select who you want to send a message to, the system will take care of transferring messages according to the algorithm you select.
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

Durante la práctica de laboratorio se realiza el desarrollo de la implementación de algoritmos de enrutamiento que funcionan con nodos interconectados entre sí, donde cada uno conoce únicamente cuales son los vecinos que tiene dicho nodo por lo que es importante generar un algoritmo de enrutamiento que establecerá quienes serán los vecinos de cada uno de los nodos (quienes son los aptos para recibir mensajes). 

Para ello, debemos de conocer cuál es el objetivo de un protocolo de enrutamiento es crear y mantener una tabla de enrutamiento. Esta tabla contiene las redes conocidas y los puertos asociados a dichas redes. Los routers utilizan protocolos de enrutamiento para administrar la información recibida de otros routers, la información que se conoce a partir de la configuración de sus propias interfaces, y las rutas configuradas manualmente. Los protocolos de enrutamiento aprenden todas las rutas disponibles, incluyen las mejores rutas en las tablas de enrutamiento y descartan las rutas que ya no son válidas. 

El router utiliza la información en la tabla de enrutamiento para enviar los paquetes de datos El algoritmo de enrutamiento es fundamental para el enrutamiento dinámico. Al haber cambios en la topología de una red, por razones de crecimiento, reconfiguración o falla, la información conocida acerca de la red también debe cambiar. 


La información conocida debe reflejar una visión exacta y coherente de la nueva topología debido a esto es importante que conozcamos la implementación de los siguientes algoritmos: 
  •	Flooding
  •	Distance vector routing
  •	Link state routing
  
Para poder comprender los diferentes tipos de algoritmos de enrutamiento y su funcionamiento deberemos de implementar un programa que utilice la base del xmpp para poder crear una transferencia de información entre los diferentes nodos que pertenezcan a la red. 

El programa deberá de ser capaz de recibir la tabla de ruta que se utilizará en la transferencia de información y es de suma importancia que, para poder implementar una simulación de forma correcta. Lo requerido es que el programa sea capaz de interpretar una interconexión como la siguiente: 
 
Al momento de hacer login en el sistema deberá de indicar que nodo es y el sistema lo identificará en el mapa de rutas con sus vecinos, deberá de ingresar que tipo de algoritmo desea simular para poder visualizar la transferencia de mensajes y se mostrará la información del mensaje transferido a los otros nodos. 


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
