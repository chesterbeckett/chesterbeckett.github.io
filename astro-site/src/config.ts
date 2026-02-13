interface SiteConfig {
  readonly title: string;
  readonly description: string;
  readonly defaultLanguage: string;
  readonly author: string;
  readonly email: string;
  readonly url: string;
  readonly tagline: string;
  readonly avatar: string;
  readonly timezone: string;
}

interface SocialConfig {
  readonly github: string;
  readonly twitter: string;
  readonly microsoftLearn: string;
}

interface AnalyticsConfig {
  readonly goatCounter: string;
}

export const SITE: SiteConfig = {
  title: 'Chester Beckett',
  description: 'Welcome to my Azure Support Engineers Blog, it\'s a resource for navigating and mastering Microsoft Azure. I aim to provide dedicated and in-depth articles, step-by-step tutorials, and expert tips designed to help both novice and experienced users optimize their Azure experience through real world experience.',
  defaultLanguage: 'en',
  author: 'Chester Beckett',
  email: 'example@domain.com',
  url: 'https://blog.beckett.life',
  tagline: 'Everyday Azure Engineering',
  avatar: '/assets/img/profile_logo_512.png',
  timezone: 'Europe/London'
};

export const SOCIAL: SocialConfig = {
  github: 'chesterbeckett',
  twitter: 'chesterbeckett',
  microsoftLearn: 'https://learn.microsoft.com/en-us/users/chester-beckett'
};

export const ANALYTICS: AnalyticsConfig = {
  goatCounter: 'beckett'
};
