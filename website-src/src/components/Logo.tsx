export function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="6" fill="#102334" />
      {/* lintel */}
      <rect x="8" y="10" width="24" height="3" fill="#B38A45" />
      {/* pillars */}
      <rect x="11" y="15" width="3.2" height="15" fill="#F7F4EC" />
      <rect x="18.4" y="15" width="3.2" height="15" fill="#F7F4EC" />
      <rect x="25.8" y="15" width="3.2" height="15" fill="#F7F4EC" />
      {/* plinth */}
      <rect x="8" y="31.5" width="24" height="2.5" fill="#B38A45" />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="wordmark">
      <Mark />
      <span className="wordmark-text">
        <span className="wordmark-small">UPSC</span>
        <span className="wordmark-big">Gurukul</span>
      </span>
    </span>
  )
}
