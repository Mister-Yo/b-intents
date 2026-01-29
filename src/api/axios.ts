import axios from "axios";

import { oneClickUrl } from "@/config";

export const oneClickApi = axios.create({
  baseURL: oneClickUrl,
});
