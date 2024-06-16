import React, {  useEffect, useRef, useState } from "react";
import Magic from "./ui/magic";
import CrazySpinner from "./ui/crazy-spinner";
import Asksvg from "./ui/asksvg";
import Rewritesvg from "./ui/rewritesvg";
import Translatesvg from "./ui/translatesvg";
import Autocompletesvg from "./ui/autocompletesvg";
import { motion, AnimatePresence } from "framer-motion";
import type { Editor } from "@tiptap/core";
import { useEditor } from "novel";


function Aigenerate() {
  const [visible, setVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // generating -> can be converted to false, so we need to make sure the generation gets cancelled
  // visible 

  const { editor } = useEditor();
  const setGeneratingfn = (v: boolean) => setGenerating(v);

  return (
    <div className="z-[60] bg-[#171B1F] fixed left-0 bottom-0 w-screen flex justify-center pt-4 pb-6">
      <motion.div
        animate={{
          y: visible ? "30%" : 0,
        }}
        onClick={() => {
          setVisible(!visible);
          if (visible) editor?.commands.unsetAIHighlight();
        }}
        className={`select-none relative z-[70] rounded-3xl text-[#369DFD] bg-[#21303D] px-4 py-3 text-sm flex gap-2 items-center font-medium whitespace-nowrap overflow-hidden transition-[width] w-[6.25rem] ${visible && "w-[10.55rem]"}`}
      >
        <Magic className="h-4 w-4 shrink-0 translate-y-[5%]" />
        {visible && generating ? (
          <>
            Generating <CrazySpinner />
          </>
        ) : visible ? (
          <>Press Commands</>
        ) : (
          <>Ask AI</>
        )}
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          y: visible ? "-60%" : 20,
          opacity: visible ? 1 : 0,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{
          duration: 0.2,
        }}
        className="absolute z-50 top-0"
      >
        <ToolBar  setGeneratingfn={setGeneratingfn} editor={editor} />
        <div className="h-8 w-18rem bg-blue-600  blur-[16rem]" />
      </motion.div>
    </div>
  );
}

export default Aigenerate;

const options = [
  <><Translatesvg />Translate</>,
  <><Rewritesvg />Change Tone</>,
  <><Asksvg />Ask Gemini</>,
  <><Autocompletesvg />Auto Complete</>
];

function ToolBar({
  editor,
  setGeneratingfn,
}: {
  editor: Editor;
  setGeneratingfn: (v: boolean) => void;
}) {
  const [index, setIndex] = useState(0);

  return (
    <div
      className={
        "select-none flex gap-6 bg-[#1F2428] active:scale-[.98] transition rounded-3xl px-1 py-1 text-sm font-medium"
      }
    >
      {options.map((item, idx) => (
        <div
          key={idx}
          className="relative block h-full w-full px-3 py-2 text-[#989EA4]"
          onMouseEnter={() => setIndex(idx)}
        >
          <AnimatePresence>
            {index === idx && (
              <motion.span
                onClick={() =>
                  AigenerateContent({ idx, editor, setGeneratingfn })
                }
                className="absolute select-none inset-0 block h-full w-full rounded-xl bg-[#33393D]"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div className="select-none flex items-center whitespace-nowrap gap-3 relative z-[60] pointer-events-none">
          {item}
          </div>
        </div>
      ))}
    </div>
  );
}

async function AigenerateContent({
  idx,
  editor,
  setGeneratingfn,
}: {
  idx: number;
  editor: Editor;
  setGeneratingfn: (v: boolean) => void;
}) {
  setGeneratingfn(true);

  const {from, to} = editor.view.state.selection;
  const content = editor.view.state.selection.content();
  content.content.forEach((v, i)=> {
    v.forEach((v, i)=> {
      console.log(v.text)
    })
  })

  const transaction = editor.state.tr
  transaction.replaceRange(from, to, content)

  editor.view.dispatch(transaction)

  // console.log(content)
  // content.map((v, i)=> console.log(v.content))

  // const fragment = Fragment.fromArray(content);

  // console.log(fragment)

  // editor.view.state.selection.content().content.append(content)

  setGeneratingfn(false);



  // const genAI = new GoogleGenerativeAI("AIzaSyDGwJCP9SH5gryyvh65LJ6xTZ0SOdNvzyY");
  // const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  // const result = (await model.generateContent(`${ty}, ${query}`)).response.text();

  // .insertContentAt(
  //   {
  //     from: from,
  //     to: to,
  //   },
  //   result,
  // )
  // .run();
}