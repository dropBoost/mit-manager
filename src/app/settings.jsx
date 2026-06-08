import { FaWhatsappSquare, FaPhoneSquareAlt, FaEnvelope, FaInstagramSquare, FaFacebookSquare, FaTiktok } from "react-icons/fa";
import { Pizza, Factory, Wheat, Store, Truck, PackageSearch, Settings, House, ReceiptText } from "lucide-react";

//ICONE SOCIAL

const iconMap = {
  socialFacebook: <FaFacebookSquare/>,
  socialInstagram: <FaInstagramSquare />,
  socialTikTok: <FaTiktok />,
  socialMail: <FaEnvelope />,
  socialWhatsapp: <FaWhatsappSquare/>,
  socialTel: <FaPhoneSquareAlt />,
};

// FOOTER SIGN

export const poweredBy = "powered 💜 dropboost.it"
export const description = "HI-PHOTO | sito e gestionale per fotografi"
export const version = "2.5.0"

// MANAGER MODULE

export const navManager = [
  {
    title: "Manager",
    icon: House,
    isActive: true,
    url: "/manager",
    level: ["admin", "superadmin"],
  },
  {
    title: "Odini",
    icon: Pizza,
    isActive: true,
    items: [
      { title: "Gestione", url: "/manager/ordini/gestione" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Fornitori",
    icon: Factory,
    isActive: true,
    items: [
      { title: "Anagrafica", url: "/manager/fornitori/anagrafica" },
      { title: "Schede", url: "/manager/fornitori/schede" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Prodotti",
    icon: Wheat,
    isActive: true,
    items: [
      { title: "Anagrafica", url: "/manager/prodotti/anagrafica" },
      { title: "Classificazione", url: "/manager/prodotti/classificazione" },
      { title: "Listini", url: "/manager/prodotti/listini" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Franchisee",
    icon: Store,
    isActive: true,
    items: [
      { title: "Franchisee", url: "/manager/franchisee/franchisee"},
      { title: "Sedi", url: "/manager/franchisee/sedi"},
      { title: "Indirizzi", url: "/manager/franchisee/indirizzi" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Spedizioni",
    icon: Truck,
    isActive: true,
    items: [
      { title: "Corrieri", url: "/manager/spedizioni/corrieri" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Report",
    icon: PackageSearch,
    isActive: true,
    items: [
      { title: "Ordini Fornitore", url: "/manager/report/ordini-fornitore" },
      { title: "Ordini Sede", url: "/manager/report/ordini-sede" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Settings",
    icon: Settings,
    isActive: true,
    items: [
      { title: "Aliquote IVA", url: "/manager/settings/aliquote-iva" },
      { title: "Codici Stato", url: "/manager/settings/codici-stato" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Richieste",
    icon: ReceiptText,
    isActive: true,
    items: [
      { title: "Contatti", url: "/manager/richieste/contatti" },
    ],
    level: ["admin", "superadmin"],
  },
  {
    title: "Impostazioni",
    icon: Settings,
    isActive: true,
    items: [
      { title: "Impostazioni", url: "/manager/settings" },
      { title: "Abilita Utenza", url: "/manager/settings/register" },
    ],
    level: ["admin", "superadmin"],
  },
];