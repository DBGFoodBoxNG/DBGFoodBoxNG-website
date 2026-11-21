import storeJson from "@/data/store.json";

export type DeliveryZone = {
  id: string;
  label: string;
  /** Delivery fee in NGN. */
  fee: number;
  eta: string;
};

type StoreConfig = {
  currency: string;
  deliveryNote: string;
  zones: DeliveryZone[];
};

const store = storeJson as unknown as StoreConfig;

export const deliveryZones = store.zones;
export const deliveryNote = store.deliveryNote;

export function getZone(id: string): DeliveryZone | undefined {
  return deliveryZones.find((zone) => zone.id === id);
}
