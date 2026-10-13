import { Mail, MapPin, Phone } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
} from "../ui/icons";
import { SITE } from "@/lib/site";

const socials = [
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: LinkedInIcon, label: "LinkedIn", href: "#" },
  { icon: YouTubeIcon, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-white text-[11px] text-forest-dark">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" /> {SITE.location}
          </span>
          <a
            href={`mailto:${SITE.email}`}
            className="flex items-center gap-2 hover:text-brand"
          >
            <Mail className="h-3.5 w-3.5" /> {SITE.email}
          </a>
          <a
            href={`tel:${SITE.phoneTel}`}
            className="flex items-center gap-2 hover:text-brand"
          >
            <Phone className="h-3.5 w-3.5" /> {SITE.phoneDisplay}
          </a>
        </div>

        <ul className="flex items-center gap-4">
          {socials.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                className="transition-colors hover:text-brand"
              >
                <Icon className="h-4 w-4" />
              </a>
            </li>
          ))}
        </ul>

        <p className="flex flex-wrap items-center gap-x-2 font-medium">
          Tu Embalaje <span className="text-brand">·</span> Calidad{" "}
          <span className="text-brand">·</span> Sostenibilidad{" "}
          <span className="text-brand">·</span> Confianza
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-1 border-t border-black/5 px-5 py-3 text-center text-[11px] text-ink/60 sm:flex-row sm:gap-4">
        <span>Copyright © 2026 Tu Embalaje SAS</span>
        <span className="hidden text-brand sm:inline">·</span>
        <span>
          Made by{" "}
          <a
            href="https://www.bi-voo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-purple-500 transition-colors hover:text-purple-600"
          >
            Bi-voo
          </a>
        </span>
      </div>
    </footer>
  );
}
