import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import World from "./components/3d/World";
import JambuLogo from "./components/JambuLogo";
import SoundButton from "./components/SoundButton";
import PhotoViewer from "./components/PhotoViewer";

import IntroScene from "./scenes/IntroScene";
import BirthdayScene from "./scenes/BirthdayScene";
import MemoryScene from "./scenes/MemoryScene";
import SameBirthdayScene from "./scenes/SameBirthdayScene";
import FamilyScene from "./scenes/FamilyScene";
import FinalScene from "./scenes/FinalScene";

import { STAGES } from "./lib/stages";
import { buildSlides } from "./lib/slides";
import { useAudio } from "./lib/useAudio";

const REVEAL_MS = 2300;

function App() {
  /* =====================================================
     STATE
  ===================================================== */

  const [stage, setStage] = useState(STAGES.INTRO);
  const [journey, setJourney] = useState(false);
  const [viewerKey, setViewerKey] = useState(null);

  /* =====================================================
     DATA
  ===================================================== */

  const slides = useMemo(() => buildSlides(), []);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audio = useAudio();

  /* =====================================================
     REFS
  ===================================================== */

  const scroller = useRef(null);
  const timer = useRef(null);
  const stageRef = useRef(stage);

  stageRef.current = stage;

  /* =====================================================
     FINISH INTRO REVEAL
  ===================================================== */

  const finishReveal = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }

    setStage((currentStage) => {
      if (currentStage === STAGES.REVEAL) {
        return STAGES.WORLD;
      }

      return currentStage;
    });
  }, []);

  /* =====================================================
     ENTER JAMBU'S WORLD
  ===================================================== */

  const enterWorld = useCallback(() => {
    if (stageRef.current !== STAGES.INTRO) {
      return;
    }

    setStage(STAGES.REVEAL);

    audio.enter();

    timer.current = window.setTimeout(() => {
      finishReveal();
    }, REVEAL_MS);
  }, [audio, finishReveal]);

  /* =====================================================
     KEYBOARD CONTROLS
  ===================================================== */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        stageRef.current === STAGES.INTRO &&
        !viewerKey
      ) {
        enterWorld();
      }

      if (
        event.key === "Escape" &&
        stageRef.current === STAGES.REVEAL
      ) {
        finishReveal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enterWorld, finishReveal, viewerKey]);

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  /* =====================================================
     JOURNEY INTERSECTION OBSERVER
  ===================================================== */

  useEffect(() => {
    if (!journey || !scroller.current) {
      return;
    }

    const container = scroller.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.dataset.stage
          ) {
            setStage(entry.target.dataset.stage);
          }
        });
      },
      {
        root: container,
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      }
    );

    const sections =
      container.querySelectorAll("[data-stage]");

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, [journey]);

  /* =====================================================
     JOURNEY CONTROLS
  ===================================================== */

  const beginJourney = useCallback(() => {
    setJourney(true);
    setStage(STAGES.MEMORIES);
  }, []);

  const backToWorld = useCallback(() => {
    setJourney(false);
    setStage(STAGES.WORLD);
  }, []);

  const restart = useCallback(() => {
    setJourney(false);
    setViewerKey(null);
    setStage(STAGES.INTRO);
  }, []);

  const jump = useCallback((id) => {
    const container = scroller.current;
    const target = container?.querySelector(`#${id}`);

    if (!container || !target) return;

    const top = target.offsetTop;

    container.scrollTo({
      top,
      behavior: "smooth",
    });
  }, []);

  /* =====================================================
     STAGE HELPERS
  ===================================================== */

  const inIntro =
    stage === STAGES.INTRO ||
    stage === STAGES.REVEAL;

  const inWorld =
    stage === STAGES.REVEAL ||
    stage === STAGES.WORLD;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main
      className={[
        "jambu-app",
        `stage-${String(stage).toLowerCase()}`,
        journey ? "journey-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      {/* =================================================
          GLOBAL 3D WORLD
      ================================================= */}

      <div
        className="jambu-scene"
        aria-hidden="true"
      >
        <World stage={stage} />
      </div>


      {/* =================================================
          CINEMATIC VIGNETTE
      ================================================= */}

      <div
        className="cinematic-vignette"
        aria-hidden="true"
      />


      {/* =================================================
          TOP BAR
      ================================================= */}

      <header className="jambu-topbar">

        <JambuLogo
          onClick={
            journey
              ? backToWorld
              : undefined
          }
        />


        {journey && (
          <nav
            className="journey-nav"
            aria-label="Jambu story sections"
          >

            <button
              type="button"
              onClick={() => jump("memories")}
            >
              Memories
            </button>

            <button
              type="button"
              onClick={() => jump("connection")}
            >
              Us
            </button>

            <button
              type="button"
              onClick={() => jump("family")}
            >
              Family
            </button>

            <button
              type="button"
              onClick={() => jump("final")}
            >
              Celebration
            </button>

          </nav>
        )}


        <SoundButton
          on={audio.on}
          available={audio.available}
          onClick={audio.toggle}
        />

      </header>


      {/* =================================================
          INTRO
      ================================================= */}

      {inIntro && (
        <IntroScene
          exiting={stage === STAGES.REVEAL}
          onEnter={enterWorld}
        />
      )}


      {/* =================================================
          BIRTHDAY WORLD
      ================================================= */}

      {inWorld && !journey && (
        <BirthdayScene
          onBegin={beginJourney}
        />
      )}


      {/* =================================================
          STORY JOURNEY
      ================================================= */}

      {journey && (
        <div
          className="journey"
          ref={scroller}
        >

          {/* =============================================
              MEMORY CHAPTER
          ============================================= */}

          <MemoryScene onOpen={setViewerKey} />


          {/* =============================================
              SAME BIRTHDAY CHAPTER
          ============================================= */}

          <section
            id="connection"
            data-stage={STAGES.CONNECTION}
            className="journey-section connection-section"
          >
            <SameBirthdayScene
              photos={[
                "/photos/us/us_1.jpeg",
                "/photos/us/us_2.jpeg",
                "/photos/us/us_3.jpeg",
                "/photos/us/us_4.jpeg",
                "/photos/us/us_5.jpeg",
                "/photos/us/us_6.jpeg",
                "/photos/us/us_7.jpeg",
                "/photos/us/us_8.jpeg",
              ]}

            />
          </section>


          {/* =============================================
              FAMILY CHAPTER
          ============================================= */}

          <FamilyScene onOpen={setViewerKey} />


          {/* =============================================
              FINAL CELEBRATION
          ============================================= */}

          <FinalScene
            slides={slides}
            onOpen={setViewerKey}
            onRestart={restart}
          />

        </div>
      )}


      {/* =================================================
          PHOTO VIEWER
      ================================================= */}

      {viewerKey && (
        <PhotoViewer
          slides={slides}
          openKey={viewerKey}
          onClose={() => setViewerKey(null)}
        />
      )}

    </main>
  );
}


/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default App;