export class DiscordUrl {
    public static getIconURL(id: string, icon: string): string {
        return `https://cdn.discordapp.com/icons/${id}/${icon}.png`;
    }

    public static getAvatarURL(id: string, avatar: string): string {
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
    }
}