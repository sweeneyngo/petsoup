// require the discord.js module
const { Client, MessageAttachment, Collection } = require("discord.js");

const fs = require("fs");

const client = new Client();

client.commands = new Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const { prefix, token } = require("./config.json");

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    let reply = `you didn't put your image, ${message.author} ...`;

    if (command.usage) {
      reply += `\nmaybe try this: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("oh noes, an error ...");
    let attach = new MessageAttachment(
      "https://media1.tenor.com/images/04c629ddcf97e7e86ebe2814aaa5f671/tenor.gif?itemid=14535362",
      "err.gif"
    );
    message.channel.send(attach);
  }
});

client.login(token);