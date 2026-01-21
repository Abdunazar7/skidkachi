// bot nomi
export const BOT_NAME = "Skidkachi"

// regex mashina raqamini aniqlash uchun
export const UZB_CAR_REGEX = /^(?:(0[1]|10|20|25|30|40|50|60|70|75|80|85|90|95)\s?[A-Z]\s?\d{3}\s?[A-Z]{2}|(0[1]|10|20|25|30|40|50|60|70|75|80|85|90|95)\d{3,4}[A-Z]{3})$/;

export const requiredChanels: [string, string][] = [
  ["@AskNet_uz", "https://t.me/AskNet_uz"],
  ["@testmemberchaneluz", "https://t.me/testmemberchaneluz"],
];

export const subscribeMessage = {
  uz: `A'zo bo'ldim ✅`,
  ru: `Подписался ✅`,
};

export const joinMessage = {
  uz: `Qo'shilish ➕`,
  ru: `Присоединиться ➕`,
};

export const requiredMessage = {
  uz: `Botdan to'liq foydalanish uchun \navval quyidagi kanallarga a'zo bo'ling`,
  ru: `Для полного использования бота, пожалуйста, подпишитесь на следующие каналы`,
};
