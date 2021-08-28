import { MessageActionRow, MessageButton } from "discord.js";

export const btn = (id, label) => {
  return new MessageActionRow()
    .addComponents(new MessageButton()
      .setCustomId(id)
      .setLabel(label)
      .setStyle("PRIMARY")
      .setEmoji('🦈')
      );
}

export const disabledBtn = (id, label) => {
  return new MessageActionRow()
    .addComponents(new MessageButton()
      .setCustomId(id)
      .setLabel(label)
      .setStyle("PRIMARY")
      .setDisabled()
      .setEmoji('🦈')
      );
}
