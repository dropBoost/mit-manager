import { redirect } from "next/navigation";

export default function PAGEordiniGestione() {

  redirect("/manager/ordini/gestione");

  return null;
  
}