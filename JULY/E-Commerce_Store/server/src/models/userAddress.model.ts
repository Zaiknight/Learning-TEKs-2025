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
  user_id: z.number().optional(),
  address_1: z.string(),
  address_2: z.string().optional(),
  province: z.string(),
  country: z.string(),
  contact: z.string()
})