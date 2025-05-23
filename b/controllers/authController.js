export async function login(req, res) {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Kullanıcı adı gereklidir" });
  }
  try {
    // Kullanıcı doğrulama işlemleri burada yapılacak
    // ...implementasyon burada...
    res.status(200).json({ message: "Giriş başarılı" });
  } catch (error) {    res.status(500).json({ message: "Giriş başarısız: " + error.message });
  }
}
