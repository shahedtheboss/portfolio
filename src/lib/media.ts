import type { Certification, Project } from "@/data/portfolio";

import portraitAsset from "@/assets/portrait.jpg.asset.json";
import projectRobotAsset from "@/assets/project-robot.png.asset.json";
import projectVision from "@/assets/project-vision.jpg";
import projectAutomation from "@/assets/project-automation.jpg";
import projectMl from "@/assets/project-ml.jpg";
import projectWeb from "@/assets/project-web.jpg";
import projectRfidAsset from "@/assets/project-rfid.png.asset.json";
import projectChat from "@/assets/project-chat.jpg";
import projectRestaurantAsset from "@/assets/project-restaurant.jpg.asset.json";
import projectOledAsset from "@/assets/project-oled.png.asset.json";
import projectFrozenlakeAsset from "@/assets/project-frozenlake.jpg.asset.json";
import projectMlopsAsset from "@/assets/project-mlops.jpg.asset.json";
import projectSecomAsset from "@/assets/project-secom.jpg.asset.json";
import projectDigitsAsset from "@/assets/project-digits.jpg.asset.json";
import projectDistanceAsset from "@/assets/project-distance.jpg.asset.json";
import projectEmpAsset from "@/assets/project-emp.jpg.asset.json";
import projectTodoAsset from "@/assets/project-todo.png.asset.json";
import projectPlcAsset from "@/assets/project-plc.jpg.asset.json";
import visitPowerStation1 from "@/assets/visit-power-station-1.png.asset.json";
import visitPowerStation2 from "@/assets/visit-power-station-2.png.asset.json";
import visitTranscom1 from "@/assets/visit-transcom-1.png.asset.json";
import visitTranscom2 from "@/assets/visit-transcom-2.png.asset.json";
import certMlContest from "@/assets/cert-ml-contest.png.asset.json";
import certIndustrialAutomation from "@/assets/cert-industrial-automation.png.asset.json";
import certSciblitz from "@/assets/cert-sciblitz.png.asset.json";
import certMieRobolution from "@/assets/cert-mie-robolution.png.asset.json";
import certDatathonJpg from "@/assets/cert-datathon.jpg.asset.json";
import certDatathonPdf from "@/assets/cert-datathon.pdf.asset.json";
import certPytorchJpg from "@/assets/cert-pytorch.jpg.asset.json";
import certPytorchPdf from "@/assets/cert-pytorch.pdf.asset.json";

export const projectImages: Record<Project["image"], string | readonly [string, string]> = {
  robot: projectRobotAsset.url,
  vision: projectVision,
  automation: projectAutomation,
  ml: projectMl,
  web: projectWeb,
  rfid: projectRfidAsset.url,
  chat: projectChat,
  restaurant: projectRestaurantAsset.url,
  oled: projectOledAsset.url,
  frozenlake: projectFrozenlakeAsset.url,
  mlops: projectMlopsAsset.url,
  secom: projectSecomAsset.url,
  digits: projectDigitsAsset.url,
  distance: projectDistanceAsset.url,
  emp: projectEmpAsset.url,
  todo: projectTodoAsset.url,
  plc: projectPlcAsset.url,
  powerStationVisit: [visitPowerStation1.url, visitPowerStation2.url],
  transcomVisit: [visitTranscom1.url, visitTranscom2.url],
};

export const certificationMedia: Record<
  Certification["key"],
  { thumb: string; full: string; width: number; height: number; isPdf?: boolean }
> = {
  mlContest: { thumb: certMlContest.url, full: certMlContest.url, width: 1280, height: 960 },
  industrialAutomation: {
    thumb: certIndustrialAutomation.url,
    full: certIndustrialAutomation.url,
    width: 480,
    height: 360,
  },
  sciblitz: { thumb: certSciblitz.url, full: certSciblitz.url, width: 1080, height: 797 },
  mieRobolution: {
    thumb: certMieRobolution.url,
    full: certMieRobolution.url,
    width: 480,
    height: 360,
  },
  datathon: {
    thumb: certDatathonJpg.url,
    full: certDatathonPdf.url,
    width: 1755,
    height: 1241,
    isPdf: true,
  },
  pytorchBootcamp: {
    thumb: certPytorchJpg.url,
    full: certPytorchPdf.url,
    width: 1200,
    height: 900,
    isPdf: true,
  },
};

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
];
export { portraitAsset };
