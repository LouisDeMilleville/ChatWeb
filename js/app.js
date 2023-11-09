sessionStorage.setItem("token", "null");
let messages;
let websocket = new Websocket();
let messageAEnvoyer;

//Fonction pour charger les messages après avoir récupéré le token
function loadMessages() {
    if (connexion.token === "null")
    {
        alert("Le serveur a mis trop de temps à envoyer le token, veuillez recharger la page...");
    }
    else {
        let divPseudo = window.document.getElementById("pseudo");
        let zone_texte = window.document.getElementById("messages");
        divPseudo.innerHTML = connexion.name.toUpperCase();
        messages = new LoadMessages(connexion.token);
        setTimeout('displayMessages()', 2000);
    }
}

//Fonction pour afficher les messages reçus du serveur dans la zone d'affichage
function displayMessages() {
    if (messages.liste === "undefined")
    {
        setTimeout('displayMessages()', 1000);
    }
    else {
        data = messages.liste;
        let zone_texte = window.document.getElementById("messages");
        data.forEach(message => {
            // Extraction des valeurs des clés
            const from = message.From;
            let date = message.Date;
            const text = message.Text;

            date = date.replace("T", " ");


            zone_texte.innerHTML = zone_texte.innerHTML + "<strong>[" + date + "]</strong> <em>(" + from + ")</em> " + text + "<br>" ;
        });

        zone_texte.scrollTop = zone_texte.scrollHeight;
        websocket.login(connexion.token);
    }

}

//Création d'un objet Connexion qui récupère le token et le nom de l'utilisateur
connexion = new Connexion();
//Décalage de 2s entre la récupération du token dans le constructeur de Connexion et la récupération des messages
//afin d'éviter que loadMessages utilise un token 'undefined' car le constructeur n'a pas encore reçu la réponse
//du serveur lors de l'exécution
setTimeout('loadMessages()', 2000);

let saisieMessage = window.document.getElementById("message");
let boutonEnvoyer = window.document.getElementById("bouton_envoi");

// Ajout d'une détection d'événement qui simule un clic sur le bouton envoyer lorsque l'utilisateur
//est en train de saisir un message et qu'il appuie sur entrée
saisieMessage.addEventListener("keydown", function(event) {
    // le code 13 correspond à la touche entrée
    if (event.keyCode === 13) {
        boutonEnvoyer.click();
        saisieMessage.value = "";
    }
});

//Ajout d'un événement qui exécute le code quand le bouton envoyer est cliqué par l'utilisateur ou par
//l'événement ci-dessus
boutonEnvoyer.addEventListener("click", function (){
    messageAEnvoyer = saisieMessage.value;
    messageAEnvoyer = messageAEnvoyer.replace("\n", "<br>");
    //Sécurité pour éviter l'envoi de messages vides par inadvertance
    if (messageAEnvoyer === "")
    {
        alert("Vous ne pouvez pas envoyer de message vide");
        return null;
    }


    //J'ai créé plusieurs commandes qui permettent d'effectuer plusieurs actions spécifiques
    //lorsque l'utilisateur les entre, les voici : (ps : j'ai tenté de les mettre directement
    //dans la classe Websocket mais ça me donnais plus d'erreurs qu'autres choses, je les ai donc
    //mises en bas du script js principal pour évite qu'elles gênent la lecture du code
    /*COMMANDES UTILISABLES :
     * /clear   --> Efface l'intégralité des messages affichés localement uniquement
     * /clearall --> Efface partielement les messages pour tous les utilisateurs traitant les messages reçus comme du HTML
     *  (Cela poste un message rempli de balises <br>, ils devront scroller s'ils veulent voir les messages précédents
     * /clearspam --> Poste 50 messages vides pour effacer tout message pouvant causer des erreurs aux autres utilisateurs
     * /strong --> A mettre en début de message pour que les autres le voient en gras
     * /em --> A mettre en début de message pour que les autres le voient en italique
     * /blue --> A mettre en début de message pour que les autres le voient en bleu
     * /red --> A mettre en début de message pour que les autres le voient en rouge
     * /green --> A mettre en début de message pour que les autres le voient en vert
     * /link --> A mettre en début de message suivi d'un url pour que celui-ci soit cliquable par les autres utilisateurs
     * /cookieclicker --> Déploie un cookie clicker dans le chat auquel les autres utilisateurs peuvent jouer tant que le message est chargé
     * (Oui ça fonctionne)
     */
    if (messageAEnvoyer.startsWith("/clearall"))
    {
        /*Commande pour envoyer un message rempli de retours à la ligne pour nettoyer le chat
        de tous ceux qui prennent en compte les <br>*/
        messageAEnvoyer = "Si vous prennez en compte les balises br, votre chat devrait avoir été nettoyé ;)";
        for (let i = 0 ; i<50 ; i++)
        {
            messageAEnvoyer = messageAEnvoyer + "<br>";
        }
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/clearspam"))
    {
        /* Envoie 50 messages vides de sorte que même ceux ne prennant pas en compte les retours à la ligne
        aient leur chat nettoyé*/
        //Edit : Ca permet aussi de supprimer les
        //alertes js quand des rigolos s'amusent à en injecter dans les messages chargés
        //Edit 2: Le serveur ne semble visiblement pas inquiet à l'idée que quelqu'un envoie 50 messages dans la même
        //seconde, aucun n'est rejeté et tous sont bien enregistrés à la même seconde
        messageAEnvoyer = " ";
        for (let i = 0 ; i<50;i++)
        {
            websocket.envoyerMessage(messageAEnvoyer);
        }
    }
    else if (messageAEnvoyer.startsWith("/clear"))
    {
        //Commande pour effacer tous les messages chargés (visible localement uniquement)
        let zone_texte = window.document.getElementById("messages");
        zone_texte.innerHTML = "Les messages ont bien été effacés...<br>";
    }
    else if (messageAEnvoyer.startsWith("/strong"))
    {
        //Commande pour afficher le message en gras
        //Usage : /strong message_envoyé_en_gras
        messageAEnvoyer = messageAEnvoyer.replace("/strong ", "");
        messageAEnvoyer = "<strong>" + messageAEnvoyer + "</strong>";
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/em"))
    {
        //Commande pour afficher le message en italique
        //Usage : /em message_envoyé_en_italique
        messageAEnvoyer = messageAEnvoyer.replace("/em ", "");
        messageAEnvoyer = "<em>" + messageAEnvoyer + "</em>";
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/blue"))
    {
        //Commande pour afficher le message en bleu
        //Usage : /blue message_envoyé_en_bleu
        messageAEnvoyer = messageAEnvoyer.replace("/blue ", "");
        messageAEnvoyer = "<font color=\"blue\">" + messageAEnvoyer + "</font>";
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/red"))
    {
        //Commande pour afficher le message en rouge
        //Usage : /red message_envoyé_en_rouge
        messageAEnvoyer = messageAEnvoyer.replace("/red ", "");
        messageAEnvoyer = "<font color=\"red\">" + messageAEnvoyer + "</font>";
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/green"))
    {
        //Commande pour afficher le message en vert
        //Usage : /red message_envoyé_en_vert
        messageAEnvoyer = messageAEnvoyer.replace("/green ", "");
        messageAEnvoyer = "<font color=\"green\">" + messageAEnvoyer + "</font>";
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/link"))
    {
        //Commande pour envoyer un lien cliquable
        //Usage : /link lien_cliquable
        messageAEnvoyer = messageAEnvoyer.replace("/link ", "");
        messageAEnvoyer = "<a href='" + messageAEnvoyer + "'>" + messageAEnvoyer + "</a>";
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else if (messageAEnvoyer.startsWith("/cookieclicker"))
    {
        //Commande pour déployer un cookie clicker jouable
        //Usage : /cookieclicker
        let listeCaract = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let idCompteur = '';

        //Ca sert juste à générer un id aléatoire pour le compteur dans le cas où plusieurs clickers sont déployés
        //en simultané (sinon les compteurs avaient le même id donc seul celui du 1er clicker était incrémenté, peu importe
        //le cookie sur lequel on clique, ça permet de les rendre indépendants
        for (let i = 0; i < 4; i++) {
            let index = Math.floor(Math.random() * listeCaract.length);
            idCompteur += listeCaract.charAt(index);
        }

        //On injecte le code JS qui incrémente la valeur du compteur quand le cookie est cliqué pour qu'il puisse s'exécuter chez les autres utilisateurs
        messageAEnvoyer = '<br><strong>Cookie Clicker Jouable</strong><br><em id="${idCompteur}">0</em><em> Cookies</em><br><img src="https://i.ibb.co/3WjpTGN/cookie-47942-2.png" alt="Image de cookie" onclick="let' + " w=document.getElementById('${idCompteur}');let" + ' x=w.textContent;let y=parseInt(x);y+=1;let z=y.toString();w.textContent=z"><br><em>Cliquez pour en obtenir davantage...</em>';
        websocket.envoyerMessage(messageAEnvoyer);
    }
    else
    {
        //Et si le message n'est pas reconnu comme une commande, on l'envoie tel quel au serveur via le socket
        websocket.envoyerMessage(messageAEnvoyer);
    }
    saisieMessage.value = "";

});



