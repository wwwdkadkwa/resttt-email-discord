
require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const bot = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("forgot-email")
    .setDescription("Get help recovering your Discord email"),

  new SlashCommandBuilder()
    .setName("check-email")
    .setDescription("Find places to check your Discord email"),

  new SlashCommandBuilder()
    .setName("support")
    .setDescription("Get official Discord support")
].map(command => command.toJSON());

bot.once("ready", async () => {
  console.log(`Online as ${bot.user.tag}`);

  const rest = new REST({ version: "10" })
    .setToken(process.env.DISCORD_TOKEN);

  await rest.put(
    Routes.applicationCommands(bot.user.id),
    { body: commands }
  );

  console.log("Commands registered!");
});

bot.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setFooter({ text: "Discord Email Recovery Assistant" });

  if (interaction.commandName === "forgot-email") {
    embed
      .setTitle("Forgot your Discord email?")
      .setDescription(
        "Try these steps:\n\n" +
        "1. Search your email inboxes for Discord messages.\n" +
        "2. Check your browser's saved login usernames.\n" +
        "3. Check your password manager for your Discord username.\n" +
        "4. Contact official Discord support if needed.\n\n" +
        "Never share your password or verification codes."
      );
  }

  if (interaction.commandName === "check-email") {
    embed
      .setTitle("Find your login email")
      .setDescription(
        "Check your own email inboxes for Discord messages, " +
        "or check saved login usernames in your browser.\n\n" +
        "This bot cannot access your private Discord account details."
      );
  }

  if (interaction.commandName === "support") {
    embed
      .setTitle("Official Discord Support")
      .setDescription(
        "Get account recovery assistance from Discord."
      )
      .setURL("https://support.discord.com/hc/en-us/requests/new");
  }

  await interaction.reply({
    embeds: [embed],
    ephemeral: true
  });
});

bot.login(process.env.DISCORD_TOKEN);
