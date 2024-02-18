// chat-command.ts

/**
 * Gère les commandes du chat en fonction du texte entré par l'utilisateur.
 * @param commandText Le texte de la commande entrée par l'utilisateur.
 * @param channelId L'ID du canal actuel.
 */
export function manageChatCommand(commandText: string, channelId: string, callback: Function) {
    // Extraire la commande et le paramètre potentiel
    const parts = commandText.trim().split(/\s+/);
    const command = parts[0];
    const arg = parts.slice(1).join(' ');


    const commandWithOptionalArg = ['/list', '/users'];

    // Vérifier que la commande nécessitant un argument en a un, sauf pour /list qui est optionnel
    if (!arg && !commandWithOptionalArg.includes(command.toLowerCase()) && parts.length < 2) {
        alert("This command requires an argument.");
        return;
    }

    switch (command.toLowerCase()) {
        case '/nick':
            setNickname(arg);
            break;
        case '/list':
            listChannels(arg).then(channels => callback(channels));
            break;
        case '/create':
            createChannel(arg);
            break;
        case '/delete':
            deleteChannel(arg);
            break;
        case '/join':
            joinChannel(arg);
            break;
        case '/quit':
            quitChannel(arg);
            break;
        case '/users':
            listChannelUsers(channelId);
            break;
        case '/msg': {
            // Pour /msg, l'argument doit être divisé en nickname et message
            const [nickname, ...messageParts] = parts.slice(1);
            if (!nickname || messageParts.length === 0) {
                alert("This command requires a nickname and a message.");
                return;
            }
            const message = messageParts.join(' ');
            sendPrivateMessage(nickname, message);
            break;
        }
        default:
            alert("Command not found");
    }
}

// Fonctions pour chaque commande avec des arguments clairs et la gestion des erreurs

function setNickname(nickname: string) {
    console.log(`Setting nickname to ${nickname}`);
}

async function listChannels(filter?: string) {
    console.log(`Listing available channels with filter: ${filter}`);

    // Construire l'URL avec un paramètre de requête pour le filtre, si présent
    let url = 'http://localhost:3001/channels';
    if (filter) {
        url += `?filter=${encodeURIComponent(filter)}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch channels');
        }
        const channels = await response.json();
        return channels; // Retourne la liste des canaux pour une utilisation ultérieure
    } catch (error) {
        console.error("Error listing channels:", error);
        throw error; // Propagez l'erreur pour la gérer plus loin dans l'UI, par exemple
    }
}

function createChannel(channelName: string) {
    console.log(`Creating channel: ${channelName}`);
}

function deleteChannel(channelName: string) {
    console.log(`Deleting channel: ${channelName}`);
}

function joinChannel(channelName: string) {
    console.log(`Joining channel: ${channelName}`);
}

function quitChannel(channelName: string) {
    console.log(`Quitting channel: ${channelName}`);
}

export async function listChannelUsers(channelId: string): Promise<any[]> {
    console.log(`Listing users in channel: ${channelId}`);

    try {
        const response = await fetch(`http://localhost:3001/channels/${channelId}/members`);
        if (!response.ok) {
            throw new Error('Failed to fetch channel members');
        }
        const members = await response.json();
        console.log(members);
        return members; // Retourne les membres
    } catch (error) {
        console.error("Error listing channel members:", error);
        throw error; // Propagez l'erreur pour la gérer plus loin
    }
}

function sendPrivateMessage(nickname: string, message: string) {
    console.log(`Sending private message to ${nickname}: ${message}`);
}
