import z from "zod";

export interface UserAddress{
  id: number;
  user_id: number;
  address_1: string;
  address_2: string;
  province: string;
  country: string;
  contact: string;
}

export const UserAddressDTO = z.object({
  user_id: z.number(),
  address_1: z.string(),
  address_2: z.string(),
  province: z.string(),
  country: z.string(),
  contact: z.string()
})