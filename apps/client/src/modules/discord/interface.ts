export interface Message {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string;
    discriminator: string;
    public_flags: number;
    avatar_decoration: string | null;
  };
  attachments: any[];
  embeds: {
    type: string;
    url: string;
    title: string;
    description: string;
    color: number;
  }[];
  mentions: any[];
  mention_roles: any[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: string | null;
  flags: number;
  components: any[];
}

export interface Guild {
  id: string;
  name: string;
  icon: string;
  description: null;
  home_header: null;
  splash: null;
  discovery_splash: null;
  features: any[];
  emojis: any[];
  stickers: any[];
  banner: null;
  owner_id: string;
  application_id: null;
  region: string;
  afk_channel_id: null;
  afk_timeout: number;
  system_channel_id: string;
  widget_enabled: boolean;
  widget_channel_id: null;
  verification_level: number;
  roles: Role[];
  default_message_notifications: number;
  mfa_level: number;
  explicit_content_filter: number;
  max_presences: null;
  max_members: number;
  max_stage_video_channel_users: number;
  max_video_channel_users: number;
  vanity_url_code: null;
  premium_tier: number;
  premium_subscription_count: number;
  system_channel_flags: number;
  preferred_locale: string;
  rules_channel_id: null;
  safety_alerts_channel_id: null;
  public_updates_channel_id: null;
  hub_type: null;
  premium_progress_bar_enabled: boolean;
  latest_onboarding_question_id: null;
  incidents_data: null;
  nsfw: boolean;
  nsfw_level: number;
}

export interface Role {
  id: string;
  name: string;
  description: null;
  permissions: string;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
  icon: null;
  unicode_emoji: null;
  flags: number;
  tags?: Tags;
}

export interface Tags {
  bot_id: string;
}

export interface Channel {
  id: string;
  type: number;
  flags: number;
  guild_id: string;
  name: string;
  parent_id: null;
  position: number;
}
