"use client";

import FileTree from "@/components/magicui/FileTree";
import {Terminal} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const mosaicCellsHtml = `
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.04528848571159285);backdrop-filter:blur(8.18649562328028px);-webkit-backdrop-filter:blur(8.18649562328028px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.125); backdrop-filter: blur(4.20736px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.12437629086999549);backdrop-filter:blur(6.456024224553403px);-webkit-backdrop-filter:blur(6.456024224553403px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06591727688520613);backdrop-filter:blur(6.299162540206453px);-webkit-backdrop-filter:blur(6.299162540206453px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.11767718750588123);backdrop-filter:blur(3.9504041130330734px);-webkit-backdrop-filter:blur(3.9504041130330734px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.08736261515944145);backdrop-filter:blur(9.019634747586679px);-webkit-backdrop-filter:blur(9.019634747586679px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.1025911667388248);backdrop-filter:blur(8.53956485339586px);-webkit-backdrop-filter:blur(8.53956485339586px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.08587905453947314);backdrop-filter:blur(5.826476473317598px);-webkit-backdrop-filter:blur(5.826476473317598px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.11); backdrop-filter: blur(4.12864px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.055); backdrop-filter: blur(5.17276px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10636935196300897);backdrop-filter:blur(5.990513252290839px);-webkit-backdrop-filter:blur(5.990513252290839px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06114030607392384);backdrop-filter:blur(5.97193652963324px);-webkit-backdrop-filter:blur(5.97193652963324px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.048832343031663186);backdrop-filter:blur(9.15736692149585px);-webkit-backdrop-filter:blur(9.15736692149585px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.09828686646043919);backdrop-filter:blur(8.750663250350044px);-webkit-backdrop-filter:blur(8.750663250350044px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.036182521706299924);backdrop-filter:blur(6.373439525090362px);-webkit-backdrop-filter:blur(6.373439525090362px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10005231754683858);backdrop-filter:blur(6.647749967203708px);-webkit-backdrop-filter:blur(6.647749967203708px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.11387619496793605);backdrop-filter:blur(3.4712469177720777px);-webkit-backdrop-filter:blur(3.4712469177720777px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.05983282852192327);backdrop-filter:blur(3.8449988499487517px);-webkit-backdrop-filter:blur(3.8449988499487517px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.063); backdrop-filter: blur(9.2545px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10842175658867713);backdrop-filter:blur(7.758436655567493px);-webkit-backdrop-filter:blur(7.758436655567493px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.086); backdrop-filter: blur(3.50327px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.061074092305559914);backdrop-filter:blur(6.555074777934351px);-webkit-backdrop-filter:blur(6.555074777934351px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.08301124997882223);backdrop-filter:blur(6.201583218720771px);-webkit-backdrop-filter:blur(6.201583218720771px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.09786285810590471);backdrop-filter:blur(9.200858997632167px);-webkit-backdrop-filter:blur(9.200858997632167px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.05872188587307521);backdrop-filter:blur(9.684651066891092px);-webkit-backdrop-filter:blur(9.684651066891092px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.082); backdrop-filter: blur(8.98785px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.1); backdrop-filter: blur(4.78443px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.086); backdrop-filter: blur(2.86425px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.05479249599412859);backdrop-filter:blur(6.444657249438023px);-webkit-backdrop-filter:blur(6.444657249438023px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.09521624110251813);backdrop-filter:blur(3.2578731445246376px);-webkit-backdrop-filter:blur(3.2578731445246376px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.13); backdrop-filter: blur(4.57476px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.086); backdrop-filter: blur(4.63027px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.0472524531614405);backdrop-filter:blur(2.210507828527625px);-webkit-backdrop-filter:blur(2.210507828527625px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.04477229111744236);backdrop-filter:blur(5.4872926629614085px);-webkit-backdrop-filter:blur(5.4872926629614085px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.07516244973500825);backdrop-filter:blur(5.14646697236094px);-webkit-backdrop-filter:blur(5.14646697236094px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.04305638246008658);backdrop-filter:blur(6.372997443395434px);-webkit-backdrop-filter:blur(6.372997443395434px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.03904658397564293);backdrop-filter:blur(5.407223129994236px);-webkit-backdrop-filter:blur(5.407223129994236px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.08614191791890724);backdrop-filter:blur(7.805772492691176px);-webkit-backdrop-filter:blur(7.805772492691176px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.1058210350378526);backdrop-filter:blur(6.0756592244433705px);-webkit-backdrop-filter:blur(6.0756592244433705px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.12240656991983542);backdrop-filter:blur(7.9590184541011695px);-webkit-backdrop-filter:blur(7.9590184541011695px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.07214331530365467);backdrop-filter:blur(8.45749477519712px);-webkit-backdrop-filter:blur(8.45749477519712px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.08677314601254126);backdrop-filter:blur(2.350474452279741px);-webkit-backdrop-filter:blur(2.350474452279741px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10421379215962394);backdrop-filter:blur(6.940864011019585px);-webkit-backdrop-filter:blur(6.940864011019585px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.043465241080162476);backdrop-filter:blur(9.247439788770862px);-webkit-backdrop-filter:blur(9.247439788770862px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.028235995133467133);backdrop-filter:blur(3.781553216762404px);-webkit-backdrop-filter:blur(3.781553216762404px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.05162436955002639);backdrop-filter:blur(5.266010651059332px);-webkit-backdrop-filter:blur(5.266010651059332px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.09177068420541479);backdrop-filter:blur(7.323130898494128px);-webkit-backdrop-filter:blur(7.323130898494128px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.0903803607907152);backdrop-filter:blur(2.089941041835118px);-webkit-backdrop-filter:blur(2.089941041835118px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06734159436154512);backdrop-filter:blur(7.797036045634741px);-webkit-backdrop-filter:blur(7.797036045634741px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.049557313744001345);backdrop-filter:blur(8.704398170273635px);-webkit-backdrop-filter:blur(8.704398170273635px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.057275924944650405);backdrop-filter:blur(6.806167859307607px);-webkit-backdrop-filter:blur(6.806167859307607px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.1); backdrop-filter: blur(2.33082px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.07564656569868461);backdrop-filter:blur(4.918857110675162px);-webkit-backdrop-filter:blur(4.918857110675162px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.061039348869345034);backdrop-filter:blur(4.825011423512478px);-webkit-backdrop-filter:blur(4.825011423512478px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.0509927452904003);backdrop-filter:blur(4.9764717306461534px);-webkit-backdrop-filter:blur(4.9764717306461534px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.094); backdrop-filter: blur(9.80704px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06802916659020021);backdrop-filter:blur(3.5590764918488276px);-webkit-backdrop-filter:blur(3.5590764918488276px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.118); backdrop-filter: blur(9.79453px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10465809455103096);backdrop-filter:blur(9.423457799162861px);-webkit-backdrop-filter:blur(9.423457799162861px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06167596571743876);backdrop-filter:blur(8.348293700561044px);-webkit-backdrop-filter:blur(8.348293700561044px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10642455825671358);backdrop-filter:blur(4.126771367693436px);-webkit-backdrop-filter:blur(4.126771367693436px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.09); backdrop-filter: blur(7.7869px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.118); backdrop-filter: blur(3.73959px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.05810170118388437);backdrop-filter:blur(5.777027431991883px);-webkit-backdrop-filter:blur(5.777027431991883px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.041959770280449706);backdrop-filter:blur(7.027907817646337px);-webkit-backdrop-filter:blur(7.027907817646337px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06109654251648521);backdrop-filter:blur(6.983244845891022px);-webkit-backdrop-filter:blur(6.983244845891022px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.07934118661275875);backdrop-filter:blur(3.520500987797277px);-webkit-backdrop-filter:blur(3.520500987797277px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.11223022188562416);backdrop-filter:blur(9.908527692459757px);-webkit-backdrop-filter:blur(9.908527692459757px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.11521335575485084);backdrop-filter:blur(4.665213599262643px);-webkit-backdrop-filter:blur(4.665213599262643px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color: rgba(255, 255, 255, 0.067); backdrop-filter: blur(7.57186px); transition: none;"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.10940274925082187);backdrop-filter:blur(8.36513414538058px);-webkit-backdrop-filter:blur(8.36513414538058px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06014871958940862);backdrop-filter:blur(4.550963056884939px);-webkit-backdrop-filter:blur(4.550963056884939px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.05905938794163116);backdrop-filter:blur(5.4380519403202925px);-webkit-backdrop-filter:blur(5.4380519403202925px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06882576273978884);backdrop-filter:blur(9.748096581693972px);-webkit-backdrop-filter:blur(9.748096581693972px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06358153559716015);backdrop-filter:blur(9.875853981044202px);-webkit-backdrop-filter:blur(9.875853981044202px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.0654279465974527);backdrop-filter:blur(5.505447562361951px);-webkit-backdrop-filter:blur(5.505447562361951px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.06064460845448853);backdrop-filter:blur(9.742296385295049px);-webkit-backdrop-filter:blur(9.742296385295049px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.04522468746618479);backdrop-filter:blur(5.714357302189455px);-webkit-backdrop-filter:blur(5.714357302189455px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.07587696363253014);backdrop-filter:blur(7.658578384311113px);-webkit-backdrop-filter:blur(7.658578384311113px);transition:background-color 0.3s ease"></div>
  <div class="aspect-square border border-white/10 dark:border-white/5" style="background-color:rgba(255, 255, 255, 0.11265687475871607);backdrop-filter:blur(4.566103035744163px);-webkit-backdrop-filter:blur(4.566103035744163px);transition:background-color 0.3s ease"></div>
`;

const toolRowsByTab = {
  roblox: [
    { icon: "◆", text: 'Get Children "game.Workspace"', pending: "Getting children...", status: "complete", result: "47 instances" },
    { icon: "◆", text: 'Get Script "ServerScriptService.Main"', pending: "Getting script...", status: "complete", result: "source retrieved" },
    { icon: "◆", text: "Edit Script", pending: "Editing script...", status: "complete", result: "+18 -4 lines" },
    { icon: "◆", text: 'Insert From Toolbox "low poly tree"', pending: "Inserting asset...", status: "pending", result: null },
  ],
  general: [
    { icon: "→", text: "Read src/server/PlayerData.lua", pending: "Reading file...", status: "complete", result: "847 lines" },
    { icon: "✱", text: 'Grep "handlePlayerJoin"', pending: "Searching content...", status: "complete", result: "12 matches" },
    { icon: "←", text: "Edit src/server/PlayerData.lua", pending: "Preparing edit...", status: "complete", result: "+24 -8 lines" },
    { icon: "$", text: "rojo build -o game.rbxl", pending: "Running command...", status: "pending", result: null },
  ],
  scripts: [
    { icon: "→", text: "Read src/client/init.lua", pending: "Reading file...", status: "complete", result: "234 lines" },
    { icon: "→", text: "Read src/shared/Types.lua", pending: "Reading file...", status: "complete", result: "89 lines" },
    { icon: "←", text: "Write src/client/PlayerController.lua", pending: "Writing file...", status: "complete", result: "156 lines" },
    { icon: "←", text: "Edit src/shared/Config.lua", pending: "Preparing edit...", status: "pending", result: null },
  ],
};

const tabDescriptions = {
  roblox: {
    heading: (
      <>
        AI coding assistant with{" "}
        <span className="text-foreground">deep Roblox Studio integration</span>.
        Edit scripts, manipulate instances, and query DataStores.
        All from your terminal.
      </>
    ),
  },
  general: {
    heading: (
      <>
        <span className="text-foreground">Read, write, and edit</span> any file in your codebase.
        Search with glob patterns. Execute shell commands.
        AI-powered coding assistant.
      </>
    ),
  },
  scripts: {
    heading: (
      <>
        <span className="text-foreground">Generate Luau scripts</span> for your Roblox game.
        Create client controllers, server handlers, and shared modules.
        Context-aware code generation.
      </>
    ),
  },
};

const floatRows = [
  { icon: "◆", text: 'Get Children "game.Workspace"', res: "47 instances" },
  { icon: "◆", text: 'Edit Script "ServerScriptService.Main"', res: "+18 -4 lines" },
  { icon: "~", text: "Inserting asset from Toolbox...", res: "running..." },
];

type TabType = "roblox" | "general" | "scripts";

export default function HeroPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("roblox");
  const toolRows = toolRowsByTab[activeTab];
  const description = tabDescriptions[activeTab];

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="border-border bg-background grid grid-cols-4 overflow-hidden rounded-md border lg:grid-cols-8">
        <div className="col-span-4 lg:col-span-8">
          <div className="bg-background relative aspect-[16/9] overflow-hidden sm:aspect-[26/9]">
            <div className="absolute inset-0 opacity-40 dark:opacity-30">
              <img
                alt="Forest"
                className="object-cover"
                src="/assets/redwoods-2.png"
                style={{
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 grid"
              style={{
                gridTemplateRows: "repeat(8, 1fr)",
                gridTemplateColumns: "repeat(10, 1fr)",
              }}
              dangerouslySetInnerHTML={{__html: mosaicCellsHtml}}
            />
            <div className="pointer-events-none absolute inset-0 hidden lg:block">
              <motion.div
                className="pointer-events-auto absolute right-6 top-6 w-[260px] opacity-25 transition-opacity duration-300 hover:opacity-90"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <FileTree />
              </motion.div>
              <motion.div
                className="pointer-events-auto absolute bottom-6 left-6 w-[320px] opacity-15 transition-opacity duration-300 hover:opacity-80"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="overflow-hidden rounded-xl border border-foreground/10 bg-white/60 font-mono text-xs shadow-sm backdrop-blur-sm">
                  <div className="border-foreground/10 flex items-center gap-2 border-b px-3 py-2">
                    <Terminal className="h-3.5 w-3.5 text-foreground/50" />
                    <span className="text-foreground/50">hidden-run.stud</span>
                  </div>
                  {floatRows.map((row, i) => (
                    <div key={row.text} className={`flex items-center justify-between px-3 py-2 ${i < floatRows.length - 1 ? "border-foreground/10 border-b" : ""}`}>
                      <span className="text-foreground/60">{row.icon} {row.text}</span>
                      <span className="text-[10px] text-foreground/35">{row.res}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="pointer-events-none absolute top-1/2 left-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 sm:w-[92%] md:w-[82%]">
              <div className="w-full">
                <div className="mx-auto w-[92%] md:w-[86%] lg:w-[78%]">
                  <div className="flex flex-col gap-4" />
                </div>
                <div className="mx-auto mt-4 w-[92%] md:w-[86%] lg:w-[78%]">
                  <div
                    className="rounded-md border p-4 shadow-sm backdrop-blur-md transition-[max-height] duration-300 ease-in-out md:p-5"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(12px)",
                      opacity: 1,
                      transform: "translateY(0px)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground text-xs font-medium">
                        Stud
                      </span>
                      <span className="text-muted-foreground text-xs">
                        4.2k tokens · $0.03
                      </span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, filter: "blur(8px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(8px)" }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="border-border bg-tertiary rounded-sm border font-mono"
                      >
                        {toolRows.map((row, i) => (
                        <div
                          key={row.text}
                          className={`flex h-10 items-center justify-between px-3 py-2 ${i < toolRows.length - 1 ? "border-b border-border" : ""}`}
                        >
                          <div className="mr-2 flex min-w-0 flex-1 items-center gap-2">
                            {row.status === "pending" ? (
                              <>
                                <span className="text-muted-foreground">~</span>
                                <div className="min-w-0 truncate text-sm text-muted-foreground">
                                  {row.pending}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-muted-foreground">
                                  {row.icon}
                                </span>
                                <div className="min-w-0 truncate text-sm text-muted-foreground">
                                  {row.text}
                                </div>
                              </>
                            )}
                          </div>
                          {row.status === "complete" && (
                            <span className="ml-2 flex-shrink-0 text-xs text-muted-foreground hidden sm:inline">
                              {row.result}
                            </span>
                          )}
                        </div>
                      ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary border-border relative col-span-4 h-24 overflow-hidden border-t lg:col-span-8">
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0px, transparent calc(100% / 120 - 1px), currentColor calc(100% / 120 - 1px), currentColor calc(100% / 120))",
              backgroundSize: "100% 100%",
              color: "currentColor",
            }}
          />
        </div>

        <div className="border-border bg-background col-span-4 border-t lg:col-span-8">
          <div className="flex flex-col lg:grid lg:grid-cols-12">
            <div className="lg:col-span-9">
              <div className="flex flex-col gap-0">
                <div className="tracking-tight">
                  <div className="flex-1 outline-none p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeTab}
                        initial={{ opacity: 0, filter: "blur(8px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(8px)" }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="font-display text-muted-foreground text-lg leading-relaxed sm:text-xl md:text-3xl"
                      >
                        {description.heading}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-6 py-4">
                    <h2 className="text-muted-foreground text-sm sm:text-base font-medium shrink-0">
                      How developers use Stud
                    </h2>
                    <div className="bg-muted text-muted-foreground inline-flex w-fit items-center justify-center rounded-full p-1 h-10 sm:h-12">
                      {(["roblox", "general", "scripts"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="relative inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium transition-colors"
                        >
                          {activeTab === tab && (
                            <motion.div
                              layoutId="hero-tab-pill"
                              className="absolute inset-0 rounded-full bg-background shadow-sm"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span className={`relative z-10 transition-colors duration-200 ${
                            activeTab === tab
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <aside className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-border p-6 md:p-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold">Join the waitlist</h3>
                <p className="text-muted-foreground text-sm">
                  Get early access to launches, private demos, and new Roblox workflows as they ship.
                </p>
              </div>
              <div>
                <a
                  className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-10 rounded-md px-6"
                  href="/#waitlist"
                >
                  Join Waitlist
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
