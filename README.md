# CustomBotJS - A Discord Bot for PUBG Custom Game organization

Originally for /r/PUBATTLEGROUNDS aka PUBGReddit

Based on [CustomsBot](https://github.com/Samwalton9/CustomsBot) by SamWalton.

[![CodeFactor](https://www.codefactor.io/repository/github/danbennettuk/custombotjs/badge)](https://www.codefactor.io/repository/github/danbennettuk/custombotjs)

<div align="center">
    <img src="./botlogo.png" />
</div>

## 📋 Requirements:

These are the required libraries/packages to run this bot:

-   [Node](https://nodejs.org/en/)
-   [Discord.JS](https://discord.js.org)

## 🔧 Configure:

This table outlines what the configuration settings are in `config.json`.

| Config Option                |                               Description                                |                            Example                            |
| ---------------------------- | :----------------------------------------------------------------------: | :-----------------------------------------------------------: |
| `token`                      |                            Discord Bot Token                             | `N345798SDG98NBDSFGLKHlh4.8sdglh.dfg8oe4lkndf_dhg0934sg2qevM` |
| `prefix`                     |                              Command Prefix                              |                              `$`                              |
| `host_channel_id`            |                  ID token of the hosts Discord channel                   |                       `40972350972635`                        |
| `games_channel_id`           | ID token of the Discord channel where votes and passwords will be posted |                       `40972350972635`                        |
| `chat_channel_id`            |            ID token of the Discord channel used for chatting             |                       `40972350972635`                        |
| `host_role_id`               |                    ID token of the hosts Discord role                    |                       `40972350972635`                        |
| `version`                    |                 Version of the bot. Should be left as is                 |                            `0.0.1`                            |
| `default_timer`              |                Default time in minutes for timers to use                 |                              `2`                              |
| `activity => streaming`      |                Show whether bot is live on Twitch or not                 |                            `false`                            |
| `activity => twitchUsername` |          Twitch Username for the bot to show when above is true          |                         `DanBennett`                          |
| `activity => game`           |                        Game playing in bot status                        |                `PlayerUnknown's BattleGrounds`                |

## 🚀 Usage:

```shell
$ node . # I'll script this later.
```

## 📄 License:

GPL-3.0 © [Dan Bennett](https://github.com/DanBennettUK/CustomBotJS/blob/master/LICENSE)
