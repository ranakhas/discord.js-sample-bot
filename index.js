// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token. Please make sure that you entered the token.
// config.prefix contains the message prefix. You can always change this.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`with your mind | !help`);
});

client.on('error', console.error);

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. You can limit this if you want to. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message to make people think like this bot it smart :D
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("Sorry. You don't have permissions to kick people.");
    
    // Let's first check if we have a member and if we can kick them.
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role than me? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a kick!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry. I couldn't kick because of : ${error}`));
    message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // So lets first limit this command to the ones that has "BAN_MEMBERS" permission.
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role than me? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry. I couldn't ban that user because of : ${error}`));
    message.channel.send(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge" || command === "clean" || command === "clear") {
    // This will remove messages from anyone. You can't delete more than 100 messages in one time.
    
    // get the delete count as a number
    const toDelete = parseInt(args[0], 10);
    
    if(!toDelete || toDelete < 2 || toDelete > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So simply, this fetchs messages and bulk deletes them.
    const fetched = await message.channel.fetchMessages({limit: toDelete});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`I'm not able to delete messages because: ${error}`));
  }
  
  let question = args.slice(0).join(' ');
    if(command === "guess")
    if (!question)
    return message.reply("Please ask a question!");
    var sayings = [ ':8ball: Absolutly.',
                    ':8ball: Absolutly not.',
                    ':8ball: It is true.',
                    ':8ball: Impossible.',
                    ':8ball: Of course.',
                    ':8ball: I do not think so.',
                    ':8ball: It is true.',
                    ':8ball: It is not true.',
                    ':8ball: I am very undoubtful of that.',
                    ':8ball: I am very doubtful of that.',
                    ':8ball: Sources point to no.',
                    ':8ball: Theories prove it.',
                    ':8ball: Reply hazy try again.',
                    ':8ball: Ask again later.',
                    ':8ball: Better not tell you now.',
                    ':8ball: Cannot predict now.',
                    ':8ball: Concentrate and ask again.'
        ];

        var result = Math.floor((Math.random() * sayings.length) + 0);
       message.channel.send(sayings[result]);
  
  if (message.isMentioned(client.user)) { message.reply('Maybe mauwiki know this.'); }
});

client.login(config.token);
