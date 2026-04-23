

const RestaurantLogo = ({ width = "200px", color = "#2D3E50" }) => (
  <svg 
    width={width} 
    viewBox="0 0 200 200" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Minimalist Chef Hat */}
    <path 
      d="M60 80C60 60 140 60 140 80C160 80 160 110 140 110H60C40 110 40 80 60 80Z" 
      fill={color} 
    />
    <rect x="70" y="105" width="60" height="15" rx="2" fill={color} />
    
    {/* Coding Brackets { } inside the hat area or below */}
    <text 
      x="100" 
      y="145" 
      textAnchor="middle" 
      fontFamily="monospace" 
      fontSize="24" 
      fontWeight="bold" 
      fill={color}
    >
      {"{ </> }"}
    </text>

    {/* School Name */}
    <text 
      x="100" 
      y="175" 
      textAnchor="middle" 
      fontFamily="Arial, sans-serif" 
      fontSize="14" 
      fontWeight="bold" 
      fill={color}
    >
      YOUCODE RESTO
    </text>
  </svg>
);

export default RestaurantLogo;