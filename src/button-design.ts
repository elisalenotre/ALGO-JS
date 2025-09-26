//1
type Theme = "dark" | "bright";
type Variant = "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type tokenTheme = "fg" | "bg" | "accent";

let tokens: Record<Theme, Record<tokenTheme, string>> = {
    dark: {
        fg: "#FFFFFF",
        bg: "#111827",
        accent: "#A78BFA"
    },
    bright: {
        fg: "#111827",
        bg: "#FFFFFF",
        accent: "#2563EB"
    }
};

//2
type BrightGhostProps = {
    theme: "bright",
    variant: "ghost",
    size: Exclude<Size, "lg">;
    disabled?: boolean;
};

type BrightOtherProps = {
    theme: "bright";
    variant: Exclude<Variant, "ghost">;
    size: Size;
    disabled?: boolean;
};

type DarkProps = {
    theme: "dark";
    variant: Variant;
    size: Size;
    disabled?: boolean;
};

type ButtonProps = BrightGhostProps | BrightOtherProps | DarkProps

//3
type CSSVars = Readonly<{
  "--btn-fg": string;
  "--btn-bg": string;
  "--btn-border": string;
}>;

//4
function assertNever(x: never): never {
  throw new Error("cas non géré: " + String(x));
}

//5
function styleOf(props: ButtonProps): CSSVars {
    const t = tokens[props.theme];

    let fg = t.fg;
    let bg = t.bg;
    let border = t.bg;

    switch (props.theme){
        case "dark":{
            switch (props.variant){
                case "solid":
                    fg = t.fg;
                    bg = t.accent;
                    border = t.accent;
                    break;
                case "outline":
                    fg = t.accent;
                    bg = t.bg;
                    border = t.accent;
                    break;
                case "ghost":
                    fg = t.accent;
                    bg = t.bg;
                    border = t.bg;
                    break;
                default:
                    return assertNever(props as never);
            }
            break;
        }
        case "bright": {
            switch (props.variant){
                case "solid":
                    fg = t.fg;
                    bg = t.accent;
                    border = t.accent;
                    break;
                case "outline":
                    fg = t.accent;
                    bg = t.bg;
                    border = t.accent;
                    break;
                case "ghost":
                    fg = t.accent;
                    bg = t.bg;
                    border = t.bg;
                    break;
                default:
                    return assertNever(props as never);
            }
            break;
        }
        default:
            return assertNever(props as never);
    }

    if (props.disabled) {
        const dim = (v: string) => `dim(${v})`;
        fg = dim(fg); 
        bg = dim(bg); 
        border = dim(border);
    }

    const css: CSSVars = {
    "--btn-fg": fg,
    "--btn-bg": bg,
    "--btn-border": border
    };
    return css;
}

function useButton(theme: "bright"): {
  styleFor(variant: "ghost", size: "sm" | "md", disabled?: boolean): CSSVars;
  styleFor(variant: "solid" | "outline", size: Size, disabled?: boolean): CSSVars;
};

function useButton(theme: "dark"): {
  styleFor(variant: Variant, size: Size, disabled?: boolean): CSSVars;
};

function useButton(theme: Theme) {
  function styleFor(variant: Variant, size: Size, disabled?: boolean): CSSVars {
    const props = { theme, variant, size, disabled } as ButtonProps;
    return styleOf(props);
  }
  return { styleFor };
}

// tests
// styleOf({ theme: "bright", variant: "solid",   size: "lg" });
// styleOf({ theme: "bright", variant: "ghost",   size: "md" });
// styleOf({ theme: "dark",   variant: "outline", size: "sm", disabled: true });

// styleOf({ theme: "bright", variant: "ghost", size: "lg" });
// styleOf({ theme: "dark", variant: "solid", size: "xl" });

// tests useButton
const bright = useButton("bright");
bright.styleFor("outline", "lg");
bright.styleFor("ghost", "sm");

bright.styleFor("ghost", "lg");

const dark = useButton("dark");
dark.styleFor("ghost", "lg");
