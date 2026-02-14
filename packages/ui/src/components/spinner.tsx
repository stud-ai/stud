import { ComponentProps } from "solid-js"

export function Spinner(props: {
  class?: string
  classList?: ComponentProps<"div">["classList"]
  style?: ComponentProps<"div">["style"]
}) {
  return (
    <div
      {...props}
      data-component="spinner"
      classList={{
        ...(props.classList ?? {}),
        [props.class ?? ""]: !!props.class,
      }}
    >
      <div class="spinner-stud" />
      <div class="spinner-stud" />
      <div class="spinner-stud" />
    </div>
  )
}
