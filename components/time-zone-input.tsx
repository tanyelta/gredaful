"use client";

export function TimeZoneInput() {
  return (
    <input
      type="hidden"
      name="timeZone"
      ref={(element) => {
        if (element) {
          element.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
      }}
    />
  );
}
