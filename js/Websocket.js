/*
 *La classe Websocket permet au site de créer
 * un websocket qui se connecte au serveur et qui
 * lui permet de réagir correctement lorsqu'il y a des
 * communications entrantes ou sortantes
 */
class Websocket {
    //Variable de la classe
    ws;

    //Ouverture d'une connexion websocket vers le serveur lors de la création d'une instance de la classe
    constructor() {
        this.ws = new WebSocket("ws:adresse-serveur.fr:8080/ws");
        this.ws.onopen = function(event){
            console.log("Connecté au websocket !");
        };
    }

    //Méthode pour s'authentifier auprès du serveur via le socket
    login(token)
    {
        const donnees = {
            auth: token,
        };
        const donneesJson = JSON.stringify(donnees);
        this.ws.send(donneesJson);
        const msgTest = {
            message: "Message de test",
        }
        const msgJson = JSON.stringify(msgTest);
        //this.ws.send(msgJson);
        this.ws.onmessage = function(event){
            console.log("Message received from websocket : " + event.data);
            let zone_texte = window.document.getElementById("messages");
            let data = JSON.parse(event.data);
            console.log("Data : " + data);
            const from = data.From;
            let date = data.Date;
            const text = data.Text;

            date = date.replace("T", " ");


            zone_texte.innerHTML = zone_texte.innerHTML + "<strong>[" + date + "]</strong> <em>(" + from + ")</em> " + text + "<br>" ;


            zone_texte.scrollTop = zone_texte.scrollHeight;
        };
    }

    //Méthode pour envoyer un message texte au serveur
    envoyerMessage(message)
    {

        const msgAEnvoyer = {
            message: message,
        }
        const msgAEnvoyerJson = JSON.stringify(msgAEnvoyer);
        this.ws.send(msgAEnvoyerJson);

    }
}