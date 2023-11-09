# ChatWeb
Interface de chat en temps réel réalisée dans le cadre d'un cours de développement Web à l'UQAC

L'interface récupère un token d'authentification et son pseudo auprès du serveur en lui envoyant son code étudiant,
puis effectue une requête pour récupérer l'historique des messages et les afficher.

Il s'authentifie auprès du serveur via une connexion websocket afin de pouvoir
envoyer les messages de l'utilisateur et reçevoir ceux envoyés par les autres utilisateurs 
en direct.

Veuillez noter que l'adresse du serveur à joindre ainsi que le code étudiant nécessaire à la connexion ont
été anonymisés, ce dépôt sert juste d'archive.
