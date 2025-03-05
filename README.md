# Arturo's Hair Growth Simulator

A fun clicker game where you help Arturo grow his hair by clicking on his bald head!

## Game Features

- Click on Arturo's head to generate hair
- Buy upgrades to increase click power and passive income
- Offline progress - earn hair even when you're not playing
- Beautiful UI with animations and visual feedback

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Zustand for state management

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Game Mechanics

### Resources
- **Hair**: The main resource in the game
- **Click Power**: How much hair you generate per click
- **Passive Income**: How much hair you generate per second automatically

### Upgrades
- **Magic Comb**: Increases click power by 1
- **Growth Shampoo**: Generates 1 hair per second
- **Lucky Hat**: Increases click power by 5
- **Arturo's Wig**: Generates 5 hair per second
- **Hair Salon**: Generates 20 hair per second

## Game Images

The game includes placeholder SVG images in the `public/images` directory:

- `arturo-head.svg`: A picture of Arturo's bald head
- `comb.svg`: An image of a comb
- `shampoo.svg`: An image of shampoo
- `hat.svg`: An image of a hat
- `wig.svg`: An image of a wig
- `salon.svg`: An image of a hair salon

These are generated automatically when you run the script:

```bash
node scripts/generate-placeholder-images.js
```

For a production game, you might want to replace these with higher quality images.

## License

This project is licensed under the MIT License.
