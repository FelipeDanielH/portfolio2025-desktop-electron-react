import { AboutService } from '../services/aboutService';
import { HeroService } from '../services/heroService';
import { SkillsService, CategoriesService, HomeSkillsService } from '../services/skillsService';
import { registerAboutHandlers } from './aboutHandlers';
import { registerHeroHandlers } from './heroHandlers';
import { registerSkillsHandlers } from './skillsHandlers';
import { setupExperienceHandlers } from './experienceHandlers';
import { setupProjectsHandlers } from './projectsHandlers';
import { setupTechsHandlers } from './techsHandlers';
import { registerEducationHandlers } from './educationHandlers';
import { registerHomeEducationHandlers } from './homeEducationHandlers';
import { registerHomeSkillsHandlers } from './homeSkillsHandlers';
import { registerHomeExperienceHandlers } from './homeExperienceHandlers';
import { registerHomeProjectsHandlers } from './homeProjectsHandlers';
import { registerHomeAboutHandlers } from './homeAboutHandlers';
import { registerHomeCertificationsHandlers } from './homeCertificationsHandlers';
import { registerHomeHeroHandlers } from './homeHeroHandlers';
import { registerHomeContactHandlers } from './homeContactHandlers';
import { registerHomeCallToActionHandlers } from './homeCallToActionHandlers';

export function registerAllHandlers(baseURL: string) {
  const aboutService = new AboutService(baseURL);
  const heroService = new HeroService(baseURL);
  const skillsService = new SkillsService(baseURL);
  const categoriesService = new CategoriesService(baseURL);
  const homeSkillsService = new HomeSkillsService(baseURL);
  
  registerAboutHandlers(aboutService);
  registerHeroHandlers(heroService);
  registerSkillsHandlers(skillsService, categoriesService, homeSkillsService);
  setupExperienceHandlers(baseURL);
  setupProjectsHandlers(baseURL);
  setupTechsHandlers(baseURL);
  registerEducationHandlers(baseURL);
  registerHomeEducationHandlers(baseURL);
  registerHomeSkillsHandlers(baseURL);
  registerHomeExperienceHandlers(baseURL);
  registerHomeProjectsHandlers(baseURL);
  registerHomeAboutHandlers(baseURL);
  registerHomeCertificationsHandlers(baseURL);
  registerHomeHeroHandlers(baseURL);
  registerHomeContactHandlers(baseURL);
  registerHomeCallToActionHandlers(baseURL);
} 