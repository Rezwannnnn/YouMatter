// Mental health and wellness motivational quotes
export const mentalHealthQuotes = [
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown"
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn't make you a negative person. It makes you human.",
    author: "Lori Deschene"
  },
  {
    text: "Healing takes time, and asking for help is a courageous step.",
    author: "Mariska Hargitay"
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.",
    author: "Julian Seifter"
  },
  {
    text: "Self-care is how you take your power back.",
    author: "Lalah Delia"
  },
  {
    text: "It's okay to not be okay. Just don't give up.",
    author: "Unknown"
  },
  {
    text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
    author: "Noam Shpancer"
  },
  {
    text: "You are stronger than you think. You are braver than you believe.",
    author: "A.A. Milne"
  },
  {
    text: "The strongest people are not those who show strength in front of us but those who win battles we know nothing about.",
    author: "Unknown"
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein"
  },
  {
    text: "Take a deep breath. It's just a bad day, not a bad life.",
    author: "Unknown"
  },
  {
    text: "Sometimes the bravest thing you can do is ask for help.",
    author: "Unknown"
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush"
  },
  {
    text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
    author: "J.K. Rowling"
  },
  {
    text: "You are enough just as you are. Each emotion you feel, everything in your life, everything you do or do not do... where you are and who you are right now is enough.",
    author: "Unknown"
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown"
  },
  {
    text: "Be gentle with yourself. You're doing the best you can.",
    author: "Unknown"
  },
  {
    text: "Your struggles do not define you. Your strength and courage do.",
    author: "Unknown"
  },
  {
    text: "Mental health problems don't define who you are. They are something you experience. You walk in the rain and you feel the rain, but you are not the rain.",
    author: "Matt Haig"
  },
  {
    text: "It's okay to take time for yourself. Rest and self-care are so important.",
    author: "Unknown"
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    text: "Promise me you'll always remember: You're braver than you believe, stronger than you seem, and smarter than you think.",
    author: "Christopher Robin"
  },
  {
    text: "One small crack does not mean you are broken, it means that you were put to the test and you didn't fall apart.",
    author: "Linda Poindexter"
  },
  {
    text: "Tough times don't last. Tough people do.",
    author: "Robert H. Schuller"
  },
  {
    text: "You are not alone. You are seen. I am with you. You are not alone.",
    author: "Shonda Rhimes"
  },
  {
    text: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe"
  },
  {
    text: "The only way out is through.",
    author: "Robert Frost"
  },
  {
    text: "You are worthy of love and respect. Starting with your own.",
    author: "Unknown"
  },
  {
    text: "Growth is painful. Change is painful. But nothing is as painful as staying stuck somewhere you don't belong.",
    author: "Mandy Hale"
  },
  {
    text: "Your journey doesn't have to be the same as anyone else's. Take it at your own pace.",
    author: "Unknown"
  }
];

// Get daily quote based on date
export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % mentalHealthQuotes.length;
  return mentalHealthQuotes[index];
};

