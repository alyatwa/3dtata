import { Card, CardBody, Image, Button, Slider } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "react-feather";

const AudioPlayer = ({ audioSrc }: { audioSrc: string }) => {
  const [playSound, setPlaySound] = useState<boolean>(false);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio(audioSrc));
  const intervalRef = useRef<number | NodeJS.Timeout>(0);
  const isReady = useRef<boolean>(false);

  const { duration } = audioRef.current;
  useEffect(() => {
    audioRef.current?.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setPlaySound(true);
      startTimer();
    }
  }, []);
  useEffect(() => {
    if (playSound) {
      audioRef.current?.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current?.pause();
    }
  }, [playSound]);
  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current?.ended) {
      } else {
        setTrackProgress(audioRef.current?.currentTime ?? 0);
      }
    }, 1000);
  };
  const onScrub = (value: any) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!playSound) {
      setPlaySound(true);
    }
    startTimer();
  };
  const playAudio = () => {
    setPlaySound(!playSound);
  };
  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-6 gap-6 items-center justify-center">
          <div className="flex flex-col col-span-6">
            <div className="flex flex-col mt-3 gap-1">
              <Slider
                aria-label="Music progress"
                classNames={{
                  track: "bg-default-500/30",
                  thumb: "w-2 h-2 after:w-2 after:h-2 after:bg-foreground",
                }}
                onChangeEnd={() => onScrubEnd()}
                onChange={(value) => onScrub(value)}
                value={
                  duration ? Math.round((trackProgress / duration) * 100) : 0
                }
                minValue={0}
                maxValue={100}
                step={2}
                color="foreground"
                defaultValue={0}
                size="sm"
              />
              <div className="flex justify-between">
                <p className="text-small">{`${Math.floor(
                  trackProgress / 60
                )}:${(trackProgress % 60)
                  .toFixed(0)
                  .toString()
                  .padStart(2, "0")}`}</p>
                <p className="text-small text-foreground/50">{`${Math.floor(
                  duration / 60
                )}:${Math.round(duration % 60)
                  .toString()
                  .padStart(2, "0")}`}</p>
              </div>
            </div>

            <div className="flex w-full items-center justify-center">
              <Button
                onClick={() => playAudio()}
                isIconOnly
                className="data-[hover]:bg-foreground/10 -mt-[26px]"
                radius="full"
                variant="light"
              >
                {playSound ? <Pause size={25} /> : <Play size={25} />}
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default AudioPlayer;
