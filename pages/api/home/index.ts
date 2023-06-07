import { supabase } from "@/lib/supabaseClient";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = await supabase.from("gallery").select(`*`);

  return res.status(200).json(data);
}
