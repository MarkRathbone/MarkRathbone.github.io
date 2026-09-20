export default function Glass() {
  return (
    <svg className="theme-glass" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="glass-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5fcff" stopOpacity=".27" />
          <stop offset="38%" stopColor="#9edaff" stopOpacity=".04" />
          <stop offset="70%" stopColor="#d9f4ff" stopOpacity=".14" />
          <stop offset="100%" stopColor="#64bfff" stopOpacity=".02" />
        </linearGradient>
      </defs>
      <g className="glass-shards">
        <path className="glass-shard-bright" d="M505 245 650 231 621 306 529 338 465 283Z" />
        <path d="M653 226 760 199 811 286 718 326 622 306Z" />
        <path className="glass-shard-bright" d="M766 195 883 70 943 122 813 283Z" />
        <path d="M824 298 1005 280 955 433 807 411 726 340Z" />
        <path d="M616 315 712 344 651 431 537 476 508 389Z" />
        <path className="glass-shard-bright" d="M658 440 717 353 793 423 839 537 730 594 602 539Z" />
        <path d="M737 602 845 545 951 701 807 805 691 731Z" />
        <path d="M363 468 502 397 533 483 458 581 334 550Z" />
        <path d="M273 152 369 78 421 198 340 242Z" />
        <path d="M1094 150 1240 103 1196 271 1048 301Z" />
        <path d="M1079 629 1207 580 1285 707 1134 786Z" />
      </g>
      <path className="glass-fractures" d="M720 338 648 226 548 164 406 -30M720 338 763 201 883 70 943 122M720 338 825 298 1005 280 1196 229 1470 112M720 338 807 411 839 537 951 701 1150 930M720 338 716 353 658 440 602 539 458 581 294 746 184 930M720 338 621 306 508 389 363 468 95 509 -30 564M720 338 594 282 421 198 273 152 48 103M658 440 691 731 807 805 885 930" />
      <path className="glass-impact" d="m720 338-21-5 3-25 25-17 31 5 9 25-18 30-29-13Zm0 0-19 21m19-21 29-18m-29 18-18-30" />
      <path className="glass-ring" d="M648 226 711 207 763 201M811 286 835 329 807 411M793 423 730 467 658 440M621 306 594 350 616 402M533 483 602 539 691 522M951 701 1064 650 1079 629" />
      <path className="glass-glints" d="M505 245 650 231 621 306M766 195 883 70M824 298 1005 280 955 433M658 440 717 353 793 423M737 602 845 545M273 152 369 78M1094 150 1240 103" />
      <g className="glass-splinters">
        <path d="m1013 170 45-68 5 84Z" />
        <path d="m1012 535 30-65 38 79Z" />
        <path d="m498 636 54-24-19 66Z" />
        <path d="m1328 444 48-37-4 66Z" />
        <path d="m208 343 39-22-8 52Z" />
      </g>
    </svg>
  );
}
