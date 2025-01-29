const { OpenAI } = require('openai');
const { AppError } = require('../errors/customErrors');

const generate = async (prompt) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // TODO: for now cheap model
      messages: [
        { role: 'system', content: 'You are an AI lesson generator that provides structured JSON lessons.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || '';
  } catch (error) {
    throw new AppError('AI generation failed', error.message);
  }
};

module.exports = { generate };