import { z } from "zod"

export const formSchema = z.object({
  username: z.string().min(2, "En az 2 karakter olmalı").max(50, "En fazla 50 karakter olabilir"),
})