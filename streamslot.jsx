// StreamSlot - Professional Card Breaking Dashboard
// CDN-compatible version for GitHub Pages

// Make React hooks globally available
const { useState, useRef, useEffect } = React;

// Load saved state from localStorage
const loadSavedState = () => {
  try {
    const saved = localStorage.getItem('streamslot-state');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return null;
};

const savedState = loadSavedState();

function Dashboard() {
  // SPONSOR TOGGLE - Set to true to reveal sponsor sections
  const SHOW_SPONSOR = false; // Change to true when you have a sponsor
  
  const [activeTab, setActiveTab] = useState(0);
  const theme = 'dark'; // Locked to dark theme
  const [columns, setColumns] = useState(savedState?.columns ?? 10);
  const [category, setCategory] = useState(savedState?.category ?? 'nba');
  const [spacing, setSpacing] = useState(savedState?.spacing ?? 0.5);
  const [squareBoxes, setSquareBoxes] = useState(savedState?.squareBoxes ?? false);
  const [sceneHeight, setSceneHeight] = useState(savedState?.sceneHeight ?? 36);
  const [showLabels, setShowLabels] = useState(savedState?.showLabels ?? true);
  const [roundedCorners, setRoundedCorners] = useState(savedState?.roundedCorners ?? false);
  const [borders, setBorders] = useState(savedState?.borders ?? false);
  const [swapColors, setSwapColors] = useState(savedState?.swapColors ?? false);
  const [boxName, setBoxName] = useState(savedState?.boxName ?? 'Ultimate Hobby 20XX');
  const [boxNumber, setBoxNumber] = useState(savedState?.boxNumber ?? '001');
  const [sceneNote, setSceneNote] = useState(savedState?.sceneNote ?? 'Trade 2 teams for 1 respin');
  const [showBoxName, setShowBoxName] = useState(savedState?.showBoxName ?? true);
  const [showBoxNumber, setShowBoxNumber] = useState(savedState?.showBoxNumber ?? true);
  const [showSceneNote, setShowSceneNote] = useState(savedState?.showSceneNote ?? true);
  const [showSlotCount, setShowSlotCount] = useState(savedState?.showSlotCount ?? true);
  const [slotCounterText, setSlotCounterText] = useState(savedState?.slotCounterText ?? 'Remaining');
  const [sceneTextSize, setSceneTextSize] = useState(savedState?.sceneTextSize ?? 'M');
  const [chromaBackground, setChromaBackground] = useState(savedState?.chromaBackground ?? false);
  const [sceneTextColor, setSceneTextColor] = useState(savedState?.sceneTextColor ?? 'light');
  const [purchasedTeams, setPurchasedTeams] = useState(savedState?.purchasedTeams ?? {}); // { teamIndex: buyerName }
  const [transactionLog, setTransactionLog] = useState(savedState?.transactionLog ?? []); // [{ timestamp, message }]
  const [logExpanded, setLogExpanded] = useState(false); // Transaction log collapsed by default
  const [claimOverlay, setClaimOverlay] = useState(null); // { teamIndex, buyerName }
  const [streamOverlay, setStreamOverlay] = useState(null); // 'pyt' | 'stash' | '2spins' | null
  const [streamOverlayFading, setStreamOverlayFading] = useState(false);
  const [overlayDuration, setOverlayDuration] = useState(savedState?.overlayDuration ?? 7.5);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCategoryConfirm, setShowCategoryConfirm] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [customSlots, setCustomSlots] = useState(savedState?.customSlots ?? []); // Array of custom slot names
  const [customSlotsHeight, setCustomSlotsHeight] = useState(savedState?.customSlotsHeight ?? 10); // Height in rem
  const [videoOverlay, setVideoOverlay] = useState(savedState?.videoOverlay ?? {
    enabled: false,
    startRow: 1,
    startCol: 1,
    width: 2,
    height: 2
  });
  const [isCustomSlotsDragging, setIsCustomSlotsDragging] = useState(false);
  const customSlotsDragStartY = useRef(0);
  const customSlotsDragStartHeight = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const sceneRef = useRef(null);
  const [mobileSceneHidden, setMobileSceneHidden] = useState(true); // Hidden by default on mobile
  
  // Handle drag resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragStartY.current;
      const deltaRem = deltaY / 16;
      const newHeight = Math.min(64, Math.max(18, dragStartHeight.current + deltaRem));
      setSceneHeight(Math.round(newHeight));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);
  
  // Handle custom slots drag resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isCustomSlotsDragging) return;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - customSlotsDragStartY.current;
      const deltaRem = deltaY / 16;
      const newHeight = Math.min(30, Math.max(6, customSlotsDragStartHeight.current + deltaRem));
      setCustomSlotsHeight(Math.round(newHeight * 2) / 2); // Round to 0.5rem increments
    };
    
    const handleMouseUp = () => {
      setIsCustomSlotsDragging(false);
    };
    
    if (isCustomSlotsDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isCustomSlotsDragging]);
  
  const handleCustomSlotsDragStart = (e) => {
    setIsCustomSlotsDragging(true);
    customSlotsDragStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
    customSlotsDragStartHeight.current = customSlotsHeight;
  };
  
  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStartY.current = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartHeight.current = sceneHeight;
  };
  
  const nbaTeams = [
    { name: 'Hawks', city: 'Atlanta', abbr: 'ATL', primary: '#E03A3E', secondary: '#C1D32F', logo: 'https://luis-ferreras.github.io/streamslot/images/nba/hawks.svg' },
    { name: 'Celtics', city: 'Boston', abbr: 'BOS', primary: '#007A33', secondary: '#BA9653', logo: 'https://luis-ferreras.github.io/streamslot/images/nba/celtics.svg' },
    { name: 'Nets', city: 'Brooklyn', abbr: 'BKN', primary: '#000000', secondary: '#FFFFFF', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bkn.png' },
    { name: 'Hornets', city: 'Charlotte', abbr: 'CHA', primary: '#1D1160', secondary: '#00788C', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/cha.png' },
    { name: 'Bulls', city: 'Chicago', abbr: 'CHI', primary: '#FFFFFF', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png' },
    { name: 'Cavaliers', city: 'Cleveland', abbr: 'CLE', primary: '#6F263D', secondary: '#041E42', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png' },
    { name: 'Mavericks', city: 'Dallas', abbr: 'DAL', primary: '#00538C', secondary: '#B8C4CA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/dal.png' },
    { name: 'Nuggets', city: 'Denver', abbr: 'DEN', primary: '#0E2240', secondary: '#FEC524', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png' },
    { name: 'Pistons', city: 'Detroit', abbr: 'DET', primary: '#C8102E', secondary: '#1D42BA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/det.png' },
    { name: 'Warriors', city: 'Golden State', abbr: 'GSW', primary: '#1D428A', secondary: '#FFC72C', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png' },
    { name: 'Rockets', city: 'Houston', abbr: 'HOU', primary: '#C4CED4', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/hou.png' },
    { name: 'Pacers', city: 'Indiana', abbr: 'IND', primary: '#002D62', secondary: '#FDBB30', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/ind.png' },
    { name: 'Clippers', city: 'Los Angeles', abbr: 'LAC', primary: '#C8102E', secondary: '#1D428A', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lac.png' },
    { name: 'Lakers', city: 'Los Angeles', abbr: 'LAL', primary: '#552583', secondary: '#FDB927', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png' },
    { name: 'Grizzlies', city: 'Memphis', abbr: 'MEM', primary: '#5D76A9', secondary: '#12173F', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mem.png' },
    { name: 'Heat', city: 'Miami', abbr: 'MIA', primary: '#98002E', secondary: '#F9A01B', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png' },
    { name: 'Bucks', city: 'Milwaukee', abbr: 'MIL', primary: '#00471B', secondary: '#EEE1C6', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mil.png' },
    { name: 'Wolves', city: 'Minnesota', abbr: 'MIN', primary: '#0C2340', secondary: '#236192', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/min.png' },
    { name: 'Pelicans', city: 'New Orleans', abbr: 'NOP', primary: '#0C2340', secondary: '#C8102E', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/no.png' },
    { name: 'Knicks', city: 'New York', abbr: 'NYK', primary: '#006BB6', secondary: '#F58426', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/ny.png' },
    { name: 'Thunder', city: 'Oklahoma City', abbr: 'OKC', primary: '#007AC1', secondary: '#EF3B24', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/okc.png' },
    { name: 'Magic', city: 'Orlando', abbr: 'ORL', primary: '#0077C0', secondary: '#C4CED4', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png' },
    { name: '76ers', city: 'Philadelphia', abbr: 'PHI', primary: '#C4CED4', secondary: '#0B243F', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png' },
    { name: 'Suns', city: 'Phoenix', abbr: 'PHX', primary: '#1D1160', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/phx.png' },
    { name: 'Blazers', city: 'Portland', abbr: 'POR', primary: '#E03A3E', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/por.png' },
    { name: 'Kings', city: 'Sacramento', abbr: 'SAC', primary: '#5A2D81', secondary: '#63727A', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sac.png' },
    { name: 'Spurs', city: 'San Antonio', abbr: 'SAS', primary: '#C4CED4', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png' },
    { name: 'Raptors', city: 'Toronto', abbr: 'TOR', primary: '#B4975A', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/tor.png' },
    { name: 'Jazz', city: 'Utah', abbr: 'UTA', primary: '#6E9BD4', secondary: '#FFFFFF', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/utah.png' },
    { name: 'Wizards', city: 'Washington', abbr: 'WAS', primary: '#002B5C', secondary: '#E31837', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/wsh.png' },
  ];
  
  const mlbTeams = [
    { name: 'Diamondbacks', city: 'Arizona', abbr: 'ARI', primary: '#A71930', secondary: '#3EC1CD', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/ari.png' },
    { name: 'Braves', city: 'Atlanta', abbr: 'ATL', primary: '#13274F', secondary: '#CE1141', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/braves.png' },
    { name: 'Orioles', city: 'Baltimore', abbr: 'BAL', primary: '#FF4400', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/bal.png' },
    { name: 'Red Sox', city: 'Boston', abbr: 'BOS', primary: '#0C2340', secondary: '#BD3039', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/redsox.png' },
    { name: 'Cubs', city: 'Chicago', abbr: 'CHC', primary: '#0E3386', secondary: '#CC3433', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/chc.png' },
    { name: 'White Sox', city: 'Chicago', abbr: 'CHW', primary: '#000000', secondary: '#FFFFFF', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/chw.png' },
    { name: 'Reds', city: 'Cincinnati', abbr: 'CIN', primary: '#C6011F', secondary: '#000000', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/reds.png' },
    { name: 'Guardians', city: 'Cleveland', abbr: 'CLE', primary: '#00385D', secondary: '#E50022', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/guardians.png' },
    { name: 'Rockies', city: 'Colorado', abbr: 'COL', primary: '#000000', secondary: '#33006f', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/rockies.png' },
    { name: 'Tigers', city: 'Detroit', abbr: 'DET', primary: '#0C2340', secondary: '#FA4616', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/tigers.png' },
    { name: 'Astros', city: 'Houston', abbr: 'HOU', primary: '#002D62', secondary: '#EB6E1F', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/hou.png' },
    { name: 'Royals', city: 'Kansas City', abbr: 'KC', primary: '#004687', secondary: '#BD9B60', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/royals.png' },
    { name: 'Angels', city: 'Los Angeles', abbr: 'LAA', primary: '#BA0021', secondary: '#003263', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/laa.png' },
    { name: 'Dodgers', city: 'Los Angeles', abbr: 'LAD', primary: '#005A9C', secondary: '#EF3E42', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/dodgers.png' },
    { name: 'Marlins', city: 'Miami', abbr: 'MIA', primary: '#00A3E0', secondary: '#EF3340', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/mia.png' },
    { name: 'Brewers', city: 'Milwaukee', abbr: 'MIL', primary: '#00244b', secondary: '#ffc500', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/mil.png' },
    { name: 'Twins', city: 'Minnesota', abbr: 'MIN', primary: '#00193F', secondary: '#FFFFFF', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/twins.png' },
    { name: 'Mets', city: 'New York', abbr: 'NYM', primary: '#002D72', secondary: '#FF5910', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/mets.png' },
    { name: 'Yankees', city: 'New York', abbr: 'NYY', primary: '#003087', secondary: '#0C2340', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/yankees.png' },
    { name: 'Athletics', city: 'Oakland', abbr: 'OAK', primary: '#003831', secondary: '#EFB21E', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/athletics.png' },
    { name: 'Phillies', city: 'Philadelphia', abbr: 'PHI', primary: '#E81828', secondary: '#002D72', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/phillies.png' },
    { name: 'Pirates', city: 'Pittsburgh', abbr: 'PIT', primary: '#27251F', secondary: '#FDB827', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/pirates.png' },
    { name: 'Padres', city: 'San Diego', abbr: 'SD', primary: '#2F241D', secondary: '#FFC425', logo: 'https://luis-ferreras.github.io/streamslot/images/mlb/padres.png' },
    { name: 'Giants', city: 'San Francisco', abbr: 'SF', primary: '#FD5A1E', secondary: '#27251F', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sf.png' },
    { name: 'Mariners', city: 'Seattle', abbr: 'SEA', primary: '#0C2C56', secondary: '#005C5C', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png' },
    { name: 'Cardinals', city: 'St. Louis', abbr: 'STL', primary: '#C41E3A', secondary: '#0C2340', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/stl.png' },
    { name: 'Rays', city: 'Tampa Bay', abbr: 'TB', primary: '#092C5C', secondary: '#8FBCE6', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/tb.png' },
    { name: 'Rangers', city: 'Texas', abbr: 'TEX', primary: '#003278', secondary: '#C0111F', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/tex.png' },
    { name: 'Blue Jays', city: 'Toronto', abbr: 'TOR', primary: '#134A8E', secondary: '#E8291C', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/tor.png' },
    { name: 'Nationals', city: 'Washington', abbr: 'WSH', primary: '#AB0003', secondary: '#14225A', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/wsh.png' },
  ];
  
  const nflTeams = [
    { name: 'Cardinals', city: 'Arizona', abbr: 'ARI', primary: '#97233F', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png' },
    { name: 'Falcons', city: 'Atlanta', abbr: 'ATL', primary: '#A71930', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png' },
    { name: 'Ravens', city: 'Baltimore', abbr: 'BAL', primary: '#241773', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png' },
    { name: 'Bills', city: 'Buffalo', abbr: 'BUF', primary: '#00338D', secondary: '#C60C30', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png' },
    { name: 'Panthers', city: 'Carolina', abbr: 'CAR', primary: '#0085CA', secondary: '#101820', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png' },
    { name: 'Bears', city: 'Chicago', abbr: 'CHI', primary: '#0B162A', secondary: '#C83803', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png' },
    { name: 'Bengals', city: 'Cincinnati', abbr: 'CIN', primary: '#FB4F14', secondary: '#000000', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png' },
    { name: 'Browns', city: 'Cleveland', abbr: 'CLE', primary: '#311D00', secondary: '#FF3C00', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png' },
    { name: 'Cowboys', city: 'Dallas', abbr: 'DAL', primary: '#003594', secondary: '#869397', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png' },
    { name: 'Broncos', city: 'Denver', abbr: 'DEN', primary: '#FB4F14', secondary: '#002244', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png' },
    { name: 'Lions', city: 'Detroit', abbr: 'DET', primary: '#0076B6', secondary: '#B0B7BC', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png' },
    { name: 'Packers', city: 'Green Bay', abbr: 'GB', primary: '#203731', secondary: '#FFB612', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png' },
    { name: 'Texans', city: 'Houston', abbr: 'HOU', primary: '#03202F', secondary: '#A71930', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png' },
    { name: 'Colts', city: 'Indianapolis', abbr: 'IND', primary: '#002C5F', secondary: '#A2AAAD', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png' },
    { name: 'Jaguars', city: 'Jacksonville', abbr: 'JAX', primary: '#006778', secondary: '#D7A22A', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png' },
    { name: 'Chiefs', city: 'Kansas City', abbr: 'KC', primary: '#E31837', secondary: '#FFB81C', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png' },
    { name: 'Raiders', city: 'Las Vegas', abbr: 'LV', primary: '#000000', secondary: '#A5ACAF', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png' },
    { name: 'Chargers', city: 'Los Angeles', abbr: 'LAC', primary: '#0080C6', secondary: '#FFC20E', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png' },
    { name: 'Rams', city: 'Los Angeles', abbr: 'LAR', primary: '#003594', secondary: '#FF8200', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png' },
    { name: 'Dolphins', city: 'Miami', abbr: 'MIA', primary: '#008E97', secondary: '#FC4C02', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png' },
    { name: 'Vikings', city: 'Minnesota', abbr: 'MIN', primary: '#4F2683', secondary: '#FFC62F', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png' },
    { name: 'Patriots', city: 'New England', abbr: 'NE', primary: '#002244', secondary: '#C60C30', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png' },
    { name: 'Saints', city: 'New Orleans', abbr: 'NO', primary: '#D3BC8D', secondary: '#101820', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png' },
    { name: 'Giants', city: 'New York', abbr: 'NYG', primary: '#0B2265', secondary: '#A71930', logo: 'https://luis-ferreras.github.io/streamslot/images/nfl/giants.png' },
    { name: 'Jets', city: 'New York', abbr: 'NYJ', primary: '#125740', secondary: '#000000', logo: 'https://luis-ferreras.github.io/streamslot/images/nfl/jets.png' },
    { name: 'Eagles', city: 'Philadelphia', abbr: 'PHI', primary: '#004C54', secondary: '#A5ACAF', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png' },
    { name: 'Steelers', city: 'Pittsburgh', abbr: 'PIT', primary: '#FFB612', secondary: '#101820', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png' },
    { name: '49ers', city: 'San Francisco', abbr: 'SF', primary: '#AA0000', secondary: '#B3995D', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png' },
    { name: 'Seahawks', city: 'Seattle', abbr: 'SEA', primary: '#002244', secondary: '#69BE28', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png' },
    { name: 'Buccaneers', city: 'Tampa Bay', abbr: 'TB', primary: '#D50A0A', secondary: '#34302B', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png' },
    { name: 'Titans', city: 'Tennessee', abbr: 'TEN', primary: '#0C2340', secondary: '#4B92DB', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png' },
    { name: 'Commanders', city: 'Washington', abbr: 'WAS', primary: '#5A1414', secondary: '#FFB612', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png' },
  ];
  
  const allTeams = {
    nba: nbaTeams,
    mlb: mlbTeams,
    nfl: nflTeams
  };
  
  // Transaction log helper
  const addLogEntry = (message) => {
    setTransactionLog(prev => [...prev, { 
      timestamp: Date.now(), 
      message 
    }]);
  };
  
  // Create custom teams array from customSlots
  const customTeamsArray = customSlots.map((slot, i) => ({
    name: slot.name,
    city: '',
    abbr: slot.name.substring(0, 3).toUpperCase(),
    primary: slot.bgColor,
    secondary: slot.textColor,
    logo: null
  }));
  
  const currentTeams = category === 'custom' ? customTeamsArray : (allTeams[category] || nbaTeams);
  const isCustomMode = category === 'custom';
  
  const [teamOrder, setTeamOrder] = useState(() => {
    // Load from saved state if available and valid for current teams
    if (savedState?.teamOrder && savedState.teamOrder.length === currentTeams.length) {
      return savedState.teamOrder;
    }
    return currentTeams.map((_, i) => i);
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      columns,
      category,
      spacing,
      squareBoxes,
      sceneHeight,
      showLabels,
      roundedCorners,
      borders,
      swapColors,
      boxName,
      boxNumber,
      sceneNote,
      showBoxName,
      showBoxNumber,
      showSceneNote,
      showSlotCount,
      slotCounterText,
      sceneTextSize,
      chromaBackground,
      sceneTextColor,
      purchasedTeams,
      transactionLog,
      overlayDuration,
      customSlots,
      customSlotsHeight,
      videoOverlay,
      teamOrder
    };
    
    try {
      localStorage.setItem('streamslot-state', JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [columns, category, spacing, squareBoxes, sceneHeight, showLabels, roundedCorners, borders, swapColors, boxName, boxNumber, sceneNote, showBoxName, showBoxNumber, showSceneNote, showSlotCount, slotCounterText, sceneTextSize, chromaBackground, sceneTextColor, purchasedTeams, transactionLog, overlayDuration, customSlots, customSlotsHeight, videoOverlay, teamOrder]);
  
  // Handle category change with direct state updates
  const handleCategoryChange = (newCategory) => {
    if (newCategory === category) return; // Don't do anything if same category
    
    // Check if there are any purchased teams
    const hasEntries = Object.keys(purchasedTeams).length > 0;
    
    if (hasEntries) {
      // Show confirmation dialog
      setPendingCategory(newCategory);
      setShowCategoryConfirm(true);
    } else {
      // No entries, change immediately
      executeCategoryChange(newCategory);
    }
  };
  
  const executeCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPurchasedTeams({});
    
    if (newCategory === 'custom') {
      // For custom, use customSlots array
      setTeamOrder(customSlots.map((_, i) => i));
      // Enforce custom slot styling
      setSquareBoxes(false);
      setBorders(false);
      setSwapColors(false);
      setShowLabels(true);
    } else {
      const newTeams = allTeams[newCategory] || nbaTeams;
      setTeamOrder(newTeams.map((_, i) => i));
    }
  };
  
  // Auto-contrast: determine if text should be white or black based on background
  const getContrastColor = (hexColor) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    // Parse RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };
  
  // Validate hex color
  const isValidHex = (str) => /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
  
  // Normalize hex (expand shorthand and ensure #)
  const normalizeHex = (hex) => {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map(c => c + c).join('');
    }
    return '#' + h.toLowerCase();
  };
  
  // Handle adding custom slots
  const addCustomSlots = (slotsText) => {
    const newSlots = slotsText
      .split('\n')
      .map(line => {
        const parts = line.split(',').map(p => p.trim());
        const name = parts[0];
        if (!name) return null;
        
        let bgColor = '#2a2a2a'; // default dark grey
        let textColor = '#ffffff'; // default white
        
        // Check for background color
        if (parts[1] && isValidHex(parts[1])) {
          bgColor = normalizeHex(parts[1]);
          // Auto-contrast if no text color specified
          textColor = getContrastColor(bgColor);
        }
        
        // Check for explicit text color
        if (parts[2] && isValidHex(parts[2])) {
          textColor = normalizeHex(parts[2]);
        }
        
        return { name, bgColor, textColor };
      })
      .filter(s => s !== null);
    
    if (newSlots.length === 0) return;
    
    const updatedSlots = [...customSlots, ...newSlots];
    setCustomSlots(updatedSlots);
    setTeamOrder(updatedSlots.map((_, i) => i));
    setPurchasedTeams({});
  };
  
  // Handle removing a custom slot
  const removeCustomSlot = (index) => {
    const updatedSlots = customSlots.filter((_, i) => i !== index);
    setCustomSlots(updatedSlots);
    setTeamOrder(updatedSlots.map((_, i) => i));
    setPurchasedTeams({});
  };
  
  // Handle clearing all custom slots
  const clearCustomSlots = () => {
    setCustomSlots([]);
    setTeamOrder([]);
    setPurchasedTeams({});
  };
  
  const shuffleTeams = () => {
    const newOrder = [...teamOrder];
    for (let i = newOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }
    setTeamOrder(newOrder);
  };
  
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    
    observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in an input field
      const isInputFocused = e.target.tagName === 'INPUT' || 
                            e.target.tagName === 'TEXTAREA' || 
                            e.target.tagName === 'SELECT';
      
      // Ctrl/Cmd + S: Export CSV (prevent browser save dialog)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (activeTab === 3 && Object.keys(purchasedTeams).length > 0) {
          // Trigger export if on Export tab and there are purchases
          const exportButton = document.querySelector('[data-export-csv]');
          if (exportButton && !exportButton.disabled) {
            exportButton.click();
          }
        }
        return; // Important: return after handling
      }
      
      // Ctrl/Cmd + Shift + R: Shuffle teams (with confirmation)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        if (window.confirm('Shuffle all teams on the board?')) {
          shuffleTeams();
        }
        return; // Important: return after handling
      }
      
      // Escape: Close overlays and dialogs
      if (e.key === 'Escape') {
        e.preventDefault();
        if (streamOverlay) {
          setStreamOverlayFading(true);
          setTimeout(() => {
            setStreamOverlay(null);
            setStreamOverlayFading(false);
          }, 1000);
        }
        if (showResetConfirm) setShowResetConfirm(false);
        if (showCategoryConfirm) {
          setShowCategoryConfirm(false);
          setPendingCategory(null);
        }
        return; // Important: return after handling
      }
      
      // Don't trigger shortcuts below if user is typing
      if (isInputFocused) return;
      
      // Tab shortcuts: 1-5 to switch tabs
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        if (tabIndex < tabs.length) {
          setActiveTab(tabIndex);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, purchasedTeams, streamOverlay, showResetConfirm, showCategoryConfirm, shuffleTeams, setStreamOverlayFading, setStreamOverlay, setShowResetConfirm, setShowCategoryConfirm, setPendingCategory, setActiveTab]);
  
  const categories = {
    nba: { label: 'NBA Basketball', boxes: 30 },
    mlb: { label: 'MLB Baseball', boxes: 30 },
    nfl: { label: 'NFL Football', boxes: 32 },
    custom: { label: 'Custom Slots', boxes: 0 }
  };
  
  const boxes = category === 'custom' ? customSlots.length : categories[category].boxes;
  
const tabs = [
    { id: 0, label: 'Scene', icon: '◈' },
    { id: 1, label: 'Entry', icon: '◉' },
    { id: 2, label: 'Trade', icon: '⇄' },
    { id: 3, label: 'Export', icon: '↓' },
    { id: 4, label: 'Help', icon: '?' },
  ];

  const availableCount = boxes - Object.keys(purchasedTeams).length;
  
  const showClaimOverlay = (teamIndex, buyerName) => {
    setClaimOverlay({ teamIndex, buyerName });
    setTimeout(() => setClaimOverlay(null), 5000);
  };
  
  const showStreamOverlay = (type) => {
    setStreamOverlay(type);
    setStreamOverlayFading(false);
    // Start fade out 1 second before end
    setTimeout(() => setStreamOverlayFading(true), (overlayDuration - 1) * 1000);
    // Remove overlay after fade completes
    setTimeout(() => {
      setStreamOverlay(null);
      setStreamOverlayFading(false);
    }, overlayDuration * 1000);
  };
  
  const handleResetBoard = () => {
    setPurchasedTeams({});
    setTransactionLog([]);
    setBoxNumber(prev => String(parseInt(prev) + 1).padStart(prev.length, '0'));
    setShowResetConfirm(false);
  };
  
  const generateCSVData = () => {
    // Group teams by buyer
    const purchasesByBuyer = {};
    Object.entries(purchasedTeams).forEach(([teamIdx, buyer]) => {
      if (!purchasesByBuyer[buyer]) purchasesByBuyer[buyer] = [];
      purchasesByBuyer[buyer].push(parseInt(teamIdx));
    });
    
    // Generate CSV rows
    const rows = [];
    rows.push(['Box Name', 'Box Number', 'Buyer Name', 'Number of Teams', 'Teams']);
    
    Object.entries(purchasesByBuyer).forEach(([buyer, teamIndices]) => {
      const teamNames = teamIndices.map(idx => currentTeams[idx].name).join('; ');
      rows.push([boxName, boxNumber, buyer, teamIndices.length, teamNames]);
    });
    
    return rows;
  };
  
  const exportToCSV = () => {
    const rows = generateCSVData();
    const csvContent = rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    // Format date as Mon-DD-YYYY
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateStr = `${months[now.getMonth()]}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()}`;
    
    // Replace spaces with underscores in box name
    const safeBoxName = boxName.replace(/\s+/g, '_');
    
    const filename = `Export_${safeBoxName}_${boxNumber}_${dateStr}.csv`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportAndReset = () => {
    exportToCSV();
    handleResetBoard();
  };

  const tabContent = {
    0: <LayoutContent columns={columns} setColumns={setColumns} category={category} handleCategoryChange={handleCategoryChange} shuffleTeams={shuffleTeams} spacing={spacing} setSpacing={setSpacing} squareBoxes={squareBoxes} setSquareBoxes={setSquareBoxes} showLabels={showLabels} setShowLabels={setShowLabels} roundedCorners={roundedCorners} setRoundedCorners={setRoundedCorners} borders={borders} setBorders={setBorders} swapColors={swapColors} setSwapColors={setSwapColors} chromaBackground={chromaBackground} setChromaBackground={setChromaBackground} sceneTextColor={sceneTextColor} setSceneTextColor={setSceneTextColor} boxName={boxName} setBoxName={setBoxName} boxNumber={boxNumber} setBoxNumber={setBoxNumber} sceneNote={sceneNote} setSceneNote={setSceneNote} showBoxName={showBoxName} setShowBoxName={setShowBoxName} showBoxNumber={showBoxNumber} setShowBoxNumber={setShowBoxNumber} showSceneNote={showSceneNote} setShowSceneNote={setShowSceneNote} showSlotCount={showSlotCount} setShowSlotCount={setShowSlotCount} slotCounterText={slotCounterText} setSlotCounterText={setSlotCounterText} sceneTextSize={sceneTextSize} setSceneTextSize={setSceneTextSize} boxes={boxes} purchasedTeams={purchasedTeams} availableCount={availableCount} isCustomMode={isCustomMode} customSlots={customSlots} addCustomSlots={addCustomSlots} removeCustomSlot={removeCustomSlot} clearCustomSlots={clearCustomSlots} customSlotsHeight={customSlotsHeight} handleCustomSlotsDragStart={handleCustomSlotsDragStart} isCustomSlotsDragging={isCustomSlotsDragging} videoOverlay={videoOverlay} setVideoOverlay={setVideoOverlay} />,
    1: <BuyerEntryContent teams={currentTeams} teamOrder={teamOrder} purchasedTeams={purchasedTeams} setPurchasedTeams={setPurchasedTeams} showClaimOverlay={showClaimOverlay} showStreamOverlay={showStreamOverlay} setStreamOverlay={setStreamOverlay} setStreamOverlayFading={setStreamOverlayFading} overlayDuration={overlayDuration} setOverlayDuration={setOverlayDuration} category={category} isCustomMode={isCustomMode} addLogEntry={addLogEntry} />,
    2: <TradeMachineContent teams={currentTeams} purchasedTeams={purchasedTeams} setPurchasedTeams={setPurchasedTeams} addLogEntry={addLogEntry} />,
    3: <ExportContent boxName={boxName} boxNumber={boxNumber} purchasedTeams={purchasedTeams} teams={currentTeams} exportToCSV={exportToCSV} generateCSVData={generateCSVData} transactionLog={transactionLog} logExpanded={logExpanded} setLogExpanded={setLogExpanded} setTransactionLog={setTransactionLog} />,
    4: <HelpContent />,
  };

  return (
    <div className={`dashboard theme-${theme}`} style={{
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Space Mono', monospace",
      textTransform: 'uppercase',
      letterSpacing: '0.02em'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Barlow+Condensed:wght@600;700;800&family=Bungee&family=Outfit:wght@400;500;600;700;800&display=swap');
        
        /* CSS Reset */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        /* Preserve case for dropdown options only */
        select option {
          text-transform: none;
        }
        
        /* Ensure inputs and buttons are uppercase */
        input, textarea {
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        
        button, .tab-button, select {
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        
        html {
          -webkit-text-size-adjust: 100%;
          -moz-text-size-adjust: 100%;
          text-size-adjust: 100%;
          line-height: 1.15;
          height: 100vh;
          overflow: hidden;
        }
        
        body {
          margin: 0;
          padding: 0;
          min-width: 37.5rem;
          min-height: 100vh;
          height: 100vh;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        img, picture, video, canvas, svg {
          display: block;
          max-width: 100%;
        }
        
        input, button, textarea, select {
          font: inherit;
          color: inherit;
          background: none;
          border: none;
          outline: none;
        }
        
        button {
          cursor: pointer;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
        
        a {
          color: inherit;
          text-decoration: none;
        }
        
        ul, ol {
          list-style: none;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-size: inherit;
          font-weight: inherit;
        }
        
        table {
          border-collapse: collapse;
          border-spacing: 0;
        }
        
        /* End CSS Reset */
        
        .dashboard {
          background: var(--bg-gradient);
          color: var(--text-primary);
        }
        
        .theme-dark {
          --bg-gradient: #151515;
          --bg-panel: #151515;
          --bg-card: #151515;
          --bg-card-hover: #1a1a1a;
          --bg-banner: rgba(15, 15, 22, 0.8);
          --border-color: #3a3a3a;
          --border-color-inner: #3a3a3a;
          --border-hover: #4a4a4a;
          --text-primary: #e8e8ed;
          --text-secondary: rgba(255, 255, 255, 0.6);
          --text-muted: rgba(255, 255, 255, 0.35);
          --accent: #fe68ff;
          --accent-secondary: #8b5cf6;
          --drag-handle-bg: rgba(255, 255, 255, 0.05);
          --drag-handle-active: rgba(99, 102, 241, 0.25);
          --drag-handle-border: #3a3a3a;
          --drag-handle-pill: rgba(255, 255, 255, 0.3);
          --scene-text: #ffffff;
          --scene-text-border: rgba(255, 255, 255, 0.8);
        }
        
        .theme-dark
        
        .theme-light
        
        .theme-light
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(to right, #355d65 0%, #355d65 var(--value-percent, 50%), #2a2a2a var(--value-percent, 50%), #2a2a2a 100%);
          border-radius: 0.25rem;
          height: 0.375rem;
          outline: none;
          border: 1px solid #1a1a1a;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 50%;
          background: #7dd3e0;
          cursor: pointer;
          box-shadow: 0 0 0 2px #1a1a1a, 0 2px 4px rgba(0, 0, 0, 0.3);
          border: 2px solid #213338;
          transition: all 0.15s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 2px #1a1a1a, 0 0 8px rgba(125, 211, 224, 0.4);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 1.125rem;
          height: 1.125rem;
          border-radius: 50%;
          background: #7dd3e0;
          cursor: pointer;
          border: 2px solid #213338;
          box-shadow: 0 0 0 2px #1a1a1a, 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.15s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 2px #1a1a1a, 0 0 8px rgba(125, 211, 224, 0.4);
        }
        
        input[type="range"]::-moz-range-track {
          background: #2a2a2a;
          border-radius: 0.25rem;
          height: 0.375rem;
          border: 1px solid #1a1a1a;
        }
        
        input[type="range"]::-moz-range-progress {
          background: #355d65;
          border-radius: 0.25rem;
          height: 0.375rem;
        }
        
        input[type="text"]:focus {
          border-color: #fe68ff;
          box-shadow: 0 0 0 0.125rem rgba(99, 102, 241, 0.2);
        }
        
        input[type="text"]::placeholder, textarea::placeholder {
          color: var(--text-muted);
          opacity: 0.6;
        }
        
        .top-banner {
          width: 100%;
          background: var(--bg-banner);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 2rem;
          overflow: hidden;
        }
        
        .drag-handle:hover {
          background: var(--drag-handle-active) !important;
        }
        
        .drag-handle:hover > div {
          background: var(--accent) !important;
        }
        
        .scene-grid {
          width: 100%;
          height: 100%;
        }
        
        .scene-box {
          width: 100%;
          height: 100%;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 0.9375rem;
          letter-spacing: -0.03rem;
        }
        
        .logo-mark {
          width: 1.75rem;
          height: 1.75rem;
          background: #442544;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #fe68ff;
          box-shadow: none;
        }
        
        .main-container {
          display: flex;
          position: relative;
          z-index: 50;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
        }
        
        .content-area {
          flex: 1;
          padding: 1.5rem 2rem;
          position: relative;
          min-width: 0;
          overflow-x: hidden;
          overflow-y: auto;
          /* Hide scrollbar but keep scroll functionality */
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        /* Hide scrollbar for Chrome, Safari, and Opera */
        .content-area::-webkit-scrollbar {
          display: none;
        }
        
        .tab-navigation {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: var(--bg-card);
          padding: 0.5rem 0.75rem;
          border-radius: 0;
          border: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .nav-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          flex: 1;
        }
        
        .sponsor-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: var(--bg-panel);
          border-radius: 0;
          border: 1px solid var(--border-color-inner);
          font-size: 0.6875rem;
          color: var(--text-muted);
        }
        
        .sponsor-badge-name {
          font-weight: 600;
          color: var(--text-secondary);
        }
        
        .tab-buttons {
          display: flex;
          gap: 0.25rem;
          justify-content: center;
          flex-wrap: wrap;
          min-width: 0;
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          justify-content: flex-end;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          height: 2.5rem;
          padding: 0 1rem;
          border-radius: 0;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
          box-sizing: border-box;
        }
        
        .tab-button:hover {
          color: var(--text-primary);
          background: var(--bg-card-hover);
        }
        
        .tab-button.active {
          background: #1a1a1a;
          color: #ffffff;
          box-shadow: none;
        }
        
        .tab-content {
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(0.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes claimOverlayIn {
          from { 
            opacity: 0; 
            transform: scale(1.1);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        @keyframes logoPopIn {
          from { 
            opacity: 0; 
            transform: scale(0.5) rotate(-10deg);
          }
          to { 
            opacity: 1; 
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes textSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(1rem);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        @keyframes confettiFall {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pytPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.1;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.3;
          }
        }
        
        @keyframes stashSlideLeft {
          from { 
            transform: translateX(-100%);
          }
          to { 
            transform: translateX(0);
          }
        }
        
        @keyframes stashSlideRight {
          from { 
            transform: translateX(100%);
          }
          to { 
            transform: translateX(0);
          }
        }
        
        @keyframes spinBounce {
          0%, 100% { 
            transform: rotate(45deg) scale(1);
          }
          50% { 
            transform: rotate(45deg) scale(1.2);
          }
        }
        
        @keyframes slotSpin {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        @keyframes loadingBarFill {
          0% {
            transform: scaleX(0);
          }
          100% {
            transform: scaleX(1);
          }
        }
        
        @keyframes overlayFadeOut {
          from { 
            opacity: 1;
          }
          to { 
            opacity: 0;
          }
        }
        
        @keyframes teamFloat0 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) translate(1rem, -1rem) rotate(5deg); }
          50% { transform: translate(-50%, -50%) translate(0, -1.5rem) rotate(0deg); }
          75% { transform: translate(-50%, -50%) translate(-1rem, -0.5rem) rotate(-5deg); }
        }
        
        @keyframes teamFloat1 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          25% { transform: translate(-50%, -50%) translate(-1rem, -0.5rem) rotate(-3deg); }
          50% { transform: translate(-50%, -50%) translate(-0.5rem, -1.5rem) rotate(3deg); }
          75% { transform: translate(-50%, -50%) translate(1rem, -1rem) rotate(0deg); }
        }
        
        @keyframes teamFloat2 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          33% { transform: translate(-50%, -50%) translate(1.5rem, -1rem) rotate(8deg); }
          66% { transform: translate(-50%, -50%) translate(-1rem, -2rem) rotate(-5deg); }
        }
        
        @keyframes teamFloat3 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) translate(0, -2rem) rotate(10deg); }
        }
        
        @keyframes teamWiggle0 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          20% { transform: translate(-50%, -50%) translate(0.5rem, -0.5rem) rotate(8deg) scale(1.05); }
          40% { transform: translate(-50%, -50%) translate(-0.3rem, 0.5rem) rotate(-5deg) scale(0.95); }
          60% { transform: translate(-50%, -50%) translate(0.4rem, 0.3rem) rotate(6deg) scale(1.02); }
          80% { transform: translate(-50%, -50%) translate(-0.5rem, -0.3rem) rotate(-8deg) scale(0.98); }
        }
        
        @keyframes teamWiggle1 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          25% { transform: translate(-50%, -50%) translate(-0.6rem, 0.4rem) rotate(-10deg) scale(1.03); }
          50% { transform: translate(-50%, -50%) translate(0.5rem, -0.6rem) rotate(7deg) scale(0.97); }
          75% { transform: translate(-50%, -50%) translate(-0.4rem, -0.4rem) rotate(-6deg) scale(1.02); }
        }
        
        @keyframes teamWiggle2 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          33% { transform: translate(-50%, -50%) translate(0.7rem, 0.3rem) rotate(12deg) scale(1.05); }
          66% { transform: translate(-50%, -50%) translate(-0.6rem, -0.5rem) rotate(-9deg) scale(0.95); }
        }
        
        @keyframes teamWiggle3 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          20% { transform: translate(-50%, -50%) translate(-0.4rem, 0.6rem) rotate(-7deg) scale(0.98); }
          40% { transform: translate(-50%, -50%) translate(0.6rem, 0.2rem) rotate(10deg) scale(1.04); }
          60% { transform: translate(-50%, -50%) translate(0.2rem, -0.6rem) rotate(-5deg) scale(1); }
          80% { transform: translate(-50%, -50%) translate(-0.5rem, 0.4rem) rotate(8deg) scale(1.02); }
        }
        
        @keyframes teamWiggle4 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          25% { transform: translate(-50%, -50%) translate(0.4rem, -0.5rem) rotate(6deg) scale(1.06); }
          50% { transform: translate(-50%, -50%) translate(-0.5rem, 0.4rem) rotate(-11deg) scale(0.94); }
          75% { transform: translate(-50%, -50%) translate(0.3rem, 0.5rem) rotate(5deg) scale(1.01); }
        }
        
        @keyframes teamWiggle5 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          16% { transform: translate(-50%, -50%) translate(-0.3rem, -0.4rem) rotate(-8deg) scale(1.03); }
          33% { transform: translate(-50%, -50%) translate(0.5rem, 0.3rem) rotate(9deg) scale(0.97); }
          50% { transform: translate(-50%, -50%) translate(0.2rem, -0.5rem) rotate(-4deg) scale(1.05); }
          66% { transform: translate(-50%, -50%) translate(-0.4rem, 0.5rem) rotate(7deg) scale(0.98); }
          83% { transform: translate(-50%, -50%) translate(0.4rem, -0.2rem) rotate(-6deg) scale(1.02); }
        }
        
        .card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 1.5rem;
          transition: all 0.2s ease;
          min-width: 0;
          overflow: hidden;
        }
        
        .card:hover {
          border-color: var(--border-hover);
          background: var(--bg-card-hover);
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
          gap: 1.25rem;
          margin-bottom: 1.75rem;
        }
        
        /* Responsive grid utilities */
        .grid-responsive-4 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }
        
        .grid-responsive-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }
        
        .grid-responsive-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }
        
        .grid-1-3 {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 1rem;
        }
        
        .layout-controls-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.75rem;
        }
        
        .layout-controls-grid > div {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .video-overlay-grid {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: 1rem;
        }
        
        .video-overlay-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--bg-panel);
          border-radius: 0;
          border: 1px solid var(--border-color-inner);
        }
        
        .video-control-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 1.5rem;
        }
        
        .stat-label {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .stat-value {
          font-family: 'Space Mono', monospace;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #e8e8ed 0%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .stat-change {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0;
        }
        
        .stat-change.positive {
          background: #314417;
          color: #6cec35;
        }
        
        .stat-change.negative {
          background: #3f230e;
          color: #ff4e00;
        }
        
        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
          color: var(--text-primary);
        }
        
        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color-inner);
        }
        
        .list-item:last-child {
          border-bottom: none;
        }
        
        .list-item-left {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        
        .list-icon {
          width: 2.625rem;
          height: 2.625rem;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
        }
        
        .list-title {
          font-weight: 500;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .list-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .control-item {
          height: 2.5rem;
          padding: 0 0.625rem;
          background: var(--bg-card);
          border-radius: 0;
          border: 1px solid var(--border-color-inner);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .control-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        
        .control-icon {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.625rem;
          flex-shrink: 0;
        }
        
        .control-btn {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 0;
          border: 1px solid var(--border-color-inner);
          background: var(--bg-card);
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .control-btn:hover {
          background: var(--bg-card-hover);
        }
        
        .toggle-btn {
          width: 2.5rem;
          height: 1.5rem;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        
        .toggle-thumb {
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 0.25rem;
          transition: left 0.2s ease;
          box-shadow: 0 0.0625rem 0.25rem rgba(0,0,0,0.2);
        }
        
        .badge {
          padding: 0.375rem 0.75rem;
          border-radius: 0;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        /* Sponsor container responsive styles */
        .sponsor-footer {
          transition: all 0.2s ease;
        }
        
        .sponsor-modal {
          transition: all 0.2s ease;
        }
        
        .mobile-scene-toggle {
          display: none;
        }
        
        /* Tablet breakpoint */
        /* Header breakpoint - two-row layout */
        @media (max-width: 70rem) {
          .content-area {
            padding: 1.25rem 1.5rem;
          }
          
          .grid-responsive-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          
          .export-grid {
            grid-template-columns: 1fr !important;
          }
          
          .export-grid > div:last-child {
            grid-column: span 1 !important;
          }
          
          .card {
            padding: 1.25rem;
          }
          
          .tab-navigation {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .nav-left {
            flex: 1;
            min-width: 0;
          }
          
          .nav-actions {
            flex: none;
            gap: 0.5rem !important;
          }
          
          .sponsor-badge {
            font-size: 0.5625rem;
            padding: 0.25rem 0.5rem;
          }
          
          .tab-buttons {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            order: 3;
            justify-content: center;
            background: var(--bg-panel);
            padding: 0.5rem;
            border-radius: 0;
            margin-top: 0.25rem;
          }
          
          .tab-button {
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            white-space: nowrap;
          }
        }
        
        /* Mobile breakpoint */
        @media (max-width: 48rem) {
          .top-banner {
            padding: 0.75rem;
          }
          
          .top-banner.mobile-hidden {
            display: none !important;
          }
          
          .mobile-scene-toggle {
            display: flex !important;
          }
          
          .content-area {
            padding: 1rem;
          }
          
          .card {
            padding: 1rem;
            border-radius: 0;
          }
          
          .card-grid {
            grid-template-columns: 1fr;
          }
          
          /* Hide category text labels on mobile, show only emojis */
          .category-text {
            display: none;
          }
          
          /* Responsive grid breakpoints */
          .grid-responsive-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          
          .grid-responsive-3 {
            grid-template-columns: 1fr;
          }
          
          .grid-responsive-2 {
            grid-template-columns: 1fr;
          }
          
          .grid-1-3 {
            grid-template-columns: 1fr !important;
          }
          
          .layout-controls-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .layout-controls-grid > div {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .video-overlay-grid {
            grid-template-columns: 1fr !important;
          }
          
          .video-overlay-section {
            padding: 0.75rem;
          }
          
          .section-title {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          
          .sponsor-footer {
            width: 100% !important;
            max-width: 320px !important;
            height: 50px !important;
          }
          
          .sponsor-modal {
            width: 100% !important;
            max-width: 320px !important;
            height: 50px !important;
          }
          
          .mobile-scene-toggle {
            display: flex !important;
          }
          
          .buyer-entry-form {
            grid-template-columns: 1fr !important;
          }
          
          .stream-overlay-buttons {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          
          .stream-overlay-buttons > *:last-child {
            grid-column: span 2;
          }
          
          .main-container {
            margin-top: 0 !important;
            height: 100vh !important;
          }
          
          .main-container.scene-visible {
            margin-top: ${sceneHeight}rem !important;
            height: calc(100vh - ${sceneHeight}rem) !important;
          }
          
          /* Fluid control items */
          .control-item {
            min-width: 0;
          }
          
          .control-label {
            font-size: 0.6875rem;
          }
          
          .control-icon {
            width: 1.25rem !important;
            height: 1.25rem !important;
            font-size: 0.625rem !important;
          }
        }
        
        /* Small mobile */
        @media (max-width: 30rem) {
          .content-area {
            padding: 0.75rem;
          }
          
          .card {
            padding: 0.75rem;
          }
          
          .grid-responsive-4 {
            grid-template-columns: 1fr;
          }
          
          .stream-overlay-buttons {
            grid-template-columns: 1fr !important;
          }
          
          .stream-overlay-buttons > *:last-child {
            grid-column: span 1;
          }
          
          .section-title {
            font-size: 0.9375rem;
          }
          
          /* Stream overlay responsive scaling */
          .stream-overlay-icon {
            font-size: 3rem !important;
          }
          
          .stream-overlay-title {
            font-size: 2.5rem !important;
          }
          
          .stash-pass-text {
            font-size: 4rem !important;
          }
        }
        
        /* Medium screens - tablet */
        @media (max-width: 48rem) and (min-width: 30rem) {
          .stream-overlay-icon {
            font-size: 4rem !important;
          }
          
          .stream-overlay-title {
            font-size: 3.5rem !important;
          }
          
          .stash-pass-text {
            font-size: 5rem !important;
          }
        }
        
        /* Footer Responsive Styling */
        @media (max-width: 48rem) {
          .footer-top-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .footer-logo-section {
            justify-content: center !important;
          }
          
          .footer-blurb {
            text-align: center !important;
          }
          
          .footer-bottom-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.75rem !important;
          }
          
          .footer-resources,
          .footer-social {
            justify-content: center !important;
          }
        }
      `}</style>

      {/* Scene Area */}
      <div className={`top-banner ${mobileSceneHidden ? 'mobile-hidden' : ''}`} style={{ 
        height: `${sceneHeight}rem`,
        background: chromaBackground ? '#00FF00' : undefined
      }}>
        <div ref={sceneRef} style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          '--scene-text': sceneTextColor === 'light' ? '#ffffff' : '#1a1a2e',
          '--scene-text-border': sceneTextColor === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'
        }}>
        {(() => {
          const gapSize = spacing;
          const gapPx = gapSize * 16;
          
          let squareSize = 0;
          const labelHeight = showLabels ? 1.5 : 0; // rem
          const labelHeightPx = labelHeight * 16;
          const hasHeaderText = (boxName && showBoxName) || (boxNumber && showBoxNumber);
          const hasFooterText = (sceneNote && showSceneNote) || showSlotCount;
          
          // Scene text size mappings
          const textSizes = {
            S:  { headerFont: '1.25rem', headerHeight: '2.5rem', headerHeightPx: 2.5 * 16, footerFont: '0.875rem', footerHeight: '2rem', footerHeightPx: 2 * 16 },
            M:  { headerFont: '1.75rem', headerHeight: '3rem', headerHeightPx: 3 * 16, footerFont: '1.25rem', footerHeight: '2.5rem', footerHeightPx: 2.5 * 16 },
            L:  { headerFont: '2.25rem', headerHeight: '3.5rem', headerHeightPx: 3.5 * 16, footerFont: '1.5rem', footerHeight: '3rem', footerHeightPx: 3 * 16 },
            XL: { headerFont: '2.75rem', headerHeight: '4rem', headerHeightPx: 4 * 16, footerFont: '1.75rem', footerHeight: '3.5rem', footerHeightPx: 3.5 * 16 },
          };
          const currentTextSize = textSizes[sceneTextSize] || textSizes.M;
          
          const headerHeightPx = hasHeaderText ? currentTextSize.headerHeightPx : 0;
          const footerHeightPx = hasFooterText ? currentTextSize.footerHeightPx : 0;
          
          // === VIDEO OVERLAY PLACEMENT LOGIC ===
          // Build set of occupied cells
          const occupiedCells = new Set();
          if (videoOverlay.enabled) {
            for (let r = videoOverlay.startRow; r < videoOverlay.startRow + videoOverlay.height; r++) {
              for (let c = videoOverlay.startCol; c < videoOverlay.startCol + videoOverlay.width; c++) {
                occupiedCells.add(`${r}-${c}`);
              }
            }
          }
          
          // Assign teams to cells (row by row, skip occupied)
          const teamPlacements = []; // { teamIndex, row, col }
          let teamIdx = 0;
          let row = 1;
          while (teamIdx < boxes) {
            for (let col = 1; col <= columns; col++) {
              if (!occupiedCells.has(`${row}-${col}`)) {
                teamPlacements.push({ 
                  teamIndex: teamOrder[teamIdx], 
                  row, 
                  col,
                  originalIndex: teamIdx
                });
                teamIdx++;
                if (teamIdx >= boxes) break;
              }
            }
            row++;
          }
          
          const totalRows = teamPlacements.length > 0 
            ? Math.max(...teamPlacements.map(t => t.row), videoOverlay.enabled ? videoOverlay.startRow + videoOverlay.height - 1 : 0)
            : Math.ceil(boxes / columns);
          
          // Separate last row teams
          const lastRowNumber = teamPlacements.length > 0 ? Math.max(...teamPlacements.map(t => t.row)) : 1;
          const lastRowTeams = teamPlacements.filter(t => t.row === lastRowNumber);
          const mainGridTeams = teamPlacements.filter(t => t.row < lastRowNumber);
          
          // Check if last row is complete (fills all available slots in that row)
          const lastRowOccupiedByVideo = videoOverlay.enabled && 
            lastRowNumber >= videoOverlay.startRow && 
            lastRowNumber < videoOverlay.startRow + videoOverlay.height;
          const lastRowAvailableSlots = lastRowOccupiedByVideo 
            ? columns - videoOverlay.width 
            : columns;
          const lastRowIsComplete = lastRowTeams.length === lastRowAvailableSlots && lastRowAvailableSlots === columns;
          
          const hasIncompleteLastRow = !lastRowIsComplete && lastRowTeams.length > 0;
          const mainRowsCount = hasIncompleteLastRow ? lastRowNumber - 1 : lastRowNumber;
          
          // Calculate square size based on total rows
          const rows = totalRows;
          if (squareBoxes && containerSize.width > 0 && containerSize.height > 0) {
            const availableWidth = containerSize.width - (columns - 1) * gapPx;
            const availableHeight = containerSize.height - (rows - 1) * gapPx - (rows * labelHeightPx) - headerHeightPx - (hasHeaderText ? gapPx : 0) - footerHeightPx - (hasFooterText ? gapPx : 0);
            const sizeByWidth = availableWidth / columns;
            const sizeByHeight = availableHeight / rows;
            squareSize = Math.min(sizeByWidth, sizeByHeight);
          }
          
          // Helper function to calculate relative luminance
          const getLuminance = (color) => {
            // Convert hex to RGB
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16) / 255;
            const g = parseInt(hex.substr(2, 2), 16) / 255;
            const b = parseInt(hex.substr(4, 2), 16) / 255;
            
            // Apply gamma correction
            const [rs, gs, bs] = [r, g, b].map(c => 
              c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
            );
            
            // Calculate relative luminance
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          };
          
          // Helper function to get contrasting text color
          const getContrastColor = (bgColor, preferredColor) => {
            const bgLuminance = getLuminance(bgColor);
            const preferredLuminance = getLuminance(preferredColor);
            
            // Calculate contrast ratio
            const lighter = Math.max(bgLuminance, preferredLuminance);
            const darker = Math.min(bgLuminance, preferredLuminance);
            const contrastRatio = (lighter + 0.05) / (darker + 0.05);
            
            // If contrast is good (> 3:1), use preferred color
            if (contrastRatio > 3) {
              return preferredColor;
            }
            
            // If background is light, use dark text; if dark, use light text
            return bgLuminance > 0.5 ? '#1a1a1a' : '#ffffff';
          };
          
          const renderBox = (teamIndex, i, explicitWidth = null) => {
            const team = currentTeams[teamIndex];
            const isPurchased = purchasedTeams[teamIndex] !== undefined;
            const buyerName = purchasedTeams[teamIndex];
            
            // Custom mode: only show label, no logo box
            if (isCustomMode) {
              const customLabelBg = isPurchased ? '#3a3a3a' : team.primary;
              const preferredTextColor = isPurchased ? '#9ca3af' : team.secondary;
              const customLabelColor = getContrastColor(customLabelBg, preferredTextColor);
              
              return (
                <div key={i} style={{ width: '100%', position: 'relative' }}>
                  <div 
                    className="team-label"
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: customLabelBg,
                      color: customLabelColor,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      borderRadius: roundedCorners ? '0.375rem' : '0',
                      position: 'relative'
                    }}
                  >
                    {isPurchased ? buyerName : team.name}
                    {isPurchased && (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#6cec35" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ 
                          position: 'absolute',
                          right: '0.5rem',
                          width: '1rem',
                          height: '1rem',
                          filter: 'drop-shadow(0 0.0625rem 0.125rem rgba(0,0,0,0.3))'
                        }}
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              );
            }
            
            const borderRadius = roundedCorners ? '0.5rem' : '0';
            const borderColor = swapColors ? team.primary : team.secondary;
            const wrapperBorder = borders ? `0.125rem solid ${isPurchased ? '#3a3a3a' : borderColor}` : 'none';
            // Only apply inner border radius when there's no wrapper border
            const innerBorderRadius = borders ? '0' : borderRadius;
            
            const boxBg = isPurchased ? '#2a2a2a' : (swapColors ? team.secondary : team.primary);
            const labelBg = isPurchased ? '#3a3a3a' : (swapColors ? team.primary : team.secondary);
            const preferredTextColor = isPurchased ? '#9ca3af' : (swapColors ? team.secondary : team.primary);
            const labelColor = getContrastColor(labelBg, preferredTextColor);
            
            let boxSize, wrapperStyle;
            
            if (squareBoxes && squareSize > 0) {
              boxSize = {
                width: `${squareSize}px`,
                height: `${squareSize}px`
              };
              wrapperStyle = {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: wrapperBorder,
                borderRadius: borderRadius,
                overflow: 'hidden'
              };
            } else {
              boxSize = {
                width: '100%',
                height: '3rem'
              };
              wrapperStyle = {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: wrapperBorder,
                borderRadius: borderRadius,
                overflow: 'hidden'
              };
            }
            
            return (
              <div key={i} style={wrapperStyle}>
                <div 
                  className="scene-box"
                  style={{
                    ...boxSize,
                    background: boxBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderRadius: showLabels ? `${innerBorderRadius} ${innerBorderRadius} 0 0` : innerBorderRadius,
                    position: 'relative'
                  }}
                >
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={team.name}
                      style={{
                        width: squareBoxes ? '80%' : '70%',
                        height: squareBoxes ? '80%' : '100%',
                        objectFit: squareBoxes ? 'contain' : 'cover',
                        opacity: isPurchased ? 0.3 : 1,
                        filter: isPurchased ? 'grayscale(100%)' : 'none'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '1.5rem',
                      opacity: isPurchased ? 0.3 : 0.7
                    }}>
                      {team.abbr}
                    </span>
                  )}
                  {isPurchased && (
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#6cec35" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ 
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50%',
                        height: '50%',
                        filter: 'drop-shadow(0 0.125rem 0.25rem rgba(0,0,0,0.5))'
                      }}
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                {showLabels && (
                  <div 
                    className="team-label"
                    style={{
                      width: '100%',
                      height: `${labelHeight}rem`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: labelBg,
                      color: labelColor,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      borderRadius: `0 0 ${innerBorderRadius} ${innerBorderRadius}`
                    }}
                  >
                    {isPurchased ? buyerName : team.name}
                  </div>
                )}
              </div>
            );
          };
          
          // Function to style numbers with a box around them
          const styleNumbers = (text) => {
            if (!text) return null;
            const parts = String(text).split(/(\d+)/);
            return parts.map((part, idx) => {
              if (/^\d+$/.test(part)) {
                return (
                  <span key={idx} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.125rem 0.5rem',
                    marginLeft: '0.25rem',
                    marginRight: '0.25rem',
                    border: '0.125rem solid var(--scene-text-border)',
                    borderRadius: 0,
                    minWidth: '1.5em',
                    fontWeight: 700
                  }}>
                    {part}
                  </span>
                );
              }
              return part;
            });
          };
          
          const headerRow = hasHeaderText ? (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              height: currentTextSize.headerHeight,
              fontFamily: "'Outfit', sans-serif",
              fontSize: currentTextSize.headerFont,
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: 'var(--scene-text)',
              textTransform: 'uppercase',
              textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.3)'
            }}>
              {boxName && showBoxName && <span>{boxName}</span>}
              {boxNumber && showBoxNumber && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.125rem 0.5rem',
                  border: '0.125rem solid var(--scene-text-border)',
                  borderRadius: 0,
                  fontWeight: 700
                }}>
                  Box {boxNumber}
                </span>
              )}
            </div>
          ) : null;
          
          const footerRow = hasFooterText ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: `${gapSize}rem`,
              height: currentTextSize.footerHeight,
              fontFamily: "'Outfit', sans-serif",
              fontSize: currentTextSize.footerFont,
              fontWeight: 600,
              letterSpacing: '0.02em',
              color: 'var(--scene-text)',
              textTransform: 'uppercase',
              textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.3)',
              boxSizing: 'border-box',
              gridColumn: '1 / -1'
            }}>
              <span>{sceneNote && showSceneNote ? styleNumbers(sceneNote) : ''}</span>
              {showSlotCount && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {styleNumbers(String(availableCount))} {slotCounterText && <span style={{ opacity: 0.7, marginLeft: '0.375rem' }}>{slotCounterText}</span>}
                </span>
              )}
            </div>
          ) : null;
          
          // Calculate grid width for footer alignment
          const gridWidth = squareBoxes && squareSize > 0 
            ? columns * squareSize + (columns - 1) * gapPx 
            : containerSize.width - 32;
          
          // Handle incomplete last row - render separately for centering
          if (hasIncompleteLastRow) {
            // Calculate box width for non-square mode
            const nonSquareBoxWidth = containerSize.width > 0 
              ? (containerSize.width - 32 - (columns - 1) * gapPx) / columns 
              : 100;
            
            // Grid for full rows
            const mainGridStyle = squareBoxes && squareSize > 0 ? {
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, ${squareSize}px)`,
              gridTemplateRows: `repeat(${mainRowsCount}, ${squareSize + labelHeightPx}px)`,
              gap: `${gapSize}rem`,
              justifyContent: 'center',
            } : {
              display: 'grid',
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gap: `${gapSize}rem`,
              justifyContent: 'center',
              width: '100%',
              padding: '0 1rem',
              boxSizing: 'border-box',
            };
            
            // Flex row for centered last row
            const lastRowFlexStyle = {
              display: 'flex',
              justifyContent: 'center',
              gap: `${gapSize}rem`,
              marginTop: `${gapSize}rem`,
            };
            
            // Render box for last row with explicit width
            const renderLastRowBox = (teamIndex, i) => {
              const team = currentTeams[teamIndex];
              const isPurchased = purchasedTeams[teamIndex] !== undefined;
              const buyerName = purchasedTeams[teamIndex];
              
              // Custom mode: only show label, no logo box
              if (isCustomMode) {
                const customLabelBg = isPurchased ? '#3a3a3a' : team.primary;
                const preferredTextColor = isPurchased ? '#9ca3af' : team.secondary;
                const customLabelColor = getContrastColor(customLabelBg, preferredTextColor);
                const boxWidth = nonSquareBoxWidth;
                
                return (
                  <div key={i} style={{ width: `${boxWidth}px`, position: 'relative' }}>
                    <div 
                      className="team-label"
                      style={{
                        width: '100%',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: customLabelBg,
                        color: customLabelColor,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        borderRadius: roundedCorners ? '0.375rem' : '0',
                        position: 'relative'
                      }}
                    >
                      {isPurchased ? buyerName : team.name}
                      {isPurchased && (
                        <svg 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="#6cec35" 
                          strokeWidth="4" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          style={{ 
                            position: 'absolute',
                            right: '0.5rem',
                            width: '1rem',
                            height: '1rem',
                            filter: 'drop-shadow(0 0.0625rem 0.125rem rgba(0,0,0,0.3))'
                          }}
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  </div>
                );
              }
              
              const borderRadius = roundedCorners ? '0.5rem' : '0';
              const borderColor = swapColors ? team.primary : team.secondary;
              const wrapperBorder = borders ? `0.125rem solid ${isPurchased ? '#3a3a3a' : borderColor}` : 'none';
              // Only apply inner border radius when there's no wrapper border
              const innerBorderRadius = borders ? '0' : borderRadius;
              
              const boxBg = isPurchased ? '#2a2a2a' : (swapColors ? team.secondary : team.primary);
              const labelBg = isPurchased ? '#3a3a3a' : (swapColors ? team.primary : team.secondary);
              const preferredTextColor = isPurchased ? '#9ca3af' : (swapColors ? team.secondary : team.primary);
              const labelColor = getContrastColor(labelBg, preferredTextColor);
              
              const boxWidth = squareBoxes && squareSize > 0 ? squareSize : nonSquareBoxWidth;
              const boxHeight = squareBoxes && squareSize > 0 ? squareSize : 48; // 3rem = 48px
              
              return (
                <div key={i} style={{
                  width: `${boxWidth}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: wrapperBorder,
                  borderRadius: borderRadius,
                  overflow: 'hidden'
                }}>
                  <div 
                    className="scene-box"
                    style={{
                      width: '100%',
                      height: `${boxHeight}px`,
                      background: boxBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: showLabels ? `${innerBorderRadius} ${innerBorderRadius} 0 0` : innerBorderRadius,
                      position: 'relative'
                    }}
                  >
                    {team.logo ? (
                      <img 
                        src={team.logo} 
                        alt={team.name}
                        style={{
                          width: squareBoxes ? '80%' : '70%',
                          height: squareBoxes ? '80%' : '100%',
                          objectFit: squareBoxes ? 'contain' : 'cover',
                          opacity: isPurchased ? 0.3 : 1,
                          filter: isPurchased ? 'grayscale(100%)' : 'none'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{
                        fontSize: '1.5rem',
                        opacity: isPurchased ? 0.3 : 0.7
                      }}>
                        {team.abbr}
                      </span>
                    )}
                    {isPurchased && (
                      <svg 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#6cec35" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ 
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '50%',
                          height: '50%',
                          filter: 'drop-shadow(0 0.125rem 0.25rem rgba(0,0,0,0.5))'
                        }}
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  {showLabels && (
                    <div 
                      className="team-label"
                      style={{
                        width: '100%',
                        height: `${labelHeight}rem`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: labelBg,
                        color: labelColor,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        borderRadius: `0 0 ${innerBorderRadius} ${innerBorderRadius}`
                      }}
                    >
                      {isPurchased ? buyerName : team.name}
                    </div>
                  )}
                </div>
              );
            };
            
            return (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <div 
                  className="scene-grid"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                  }}
                >
                  {headerRow && <div style={{ marginBottom: `${gapSize}rem` }}>{headerRow}</div>}
                  {mainRowsCount > 0 && (
                    <div style={mainGridStyle}>
                      {videoOverlay.enabled && videoOverlay.startRow <= mainRowsCount && (
                        <div
                          style={{
                            gridColumn: `${videoOverlay.startCol} / span ${videoOverlay.width}`,
                            gridRow: `${videoOverlay.startRow} / span ${Math.min(videoOverlay.height, mainRowsCount - videoOverlay.startRow + 1)}`,
                            background: chromaBackground ? '#00FF00' : 'var(--bg-banner)',
                            borderRadius: roundedCorners ? '0.5rem' : '0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: `${Math.min(videoOverlay.width, videoOverlay.height) * 2}rem`,
                          }}
                        >
                          📹
                        </div>
                      )}
                      {mainGridTeams.map((placement) => {
                        const team = currentTeams[placement.teamIndex];
                        const isPurchased = purchasedTeams[placement.teamIndex] !== undefined;
                        const buyerName = purchasedTeams[placement.teamIndex];
                        return (
                          <div key={placement.originalIndex} style={{ gridColumn: placement.col, gridRow: placement.row }}>
                            {renderBox(placement.teamIndex, placement.originalIndex)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div style={lastRowFlexStyle}>
                    {lastRowTeams.map((placement) => renderLastRowBox(placement.teamIndex, placement.originalIndex))}
                  </div>
                  {hasFooterText && (
                    <div style={{ width: `${gridWidth}px` }}>
                      {footerRow}
                    </div>
                  )}
                </div>
              </div>
            );
          }
          
          // For complete rows, use a single grid with header as first spanning row
          const gridStyleWithHeader = squareBoxes && squareSize > 0 ? {
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, ${squareSize}px)`,
            gap: `${gapSize}rem`,
            justifyContent: 'center',
            alignContent: 'center',
          } : {
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: `${gapSize}rem`,
            justifyContent: 'center',
            alignContent: 'center',
            width: '100%',
            padding: '0 1rem',
            boxSizing: 'border-box',
          };
          
          return (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                {headerRow && <div style={{ marginBottom: `${gapSize}rem` }}>{headerRow}</div>}
                <div 
                  className="scene-grid"
                  style={gridStyleWithHeader}
                >
                  {videoOverlay.enabled && (
                    <div
                      style={{
                        gridColumn: `${videoOverlay.startCol} / span ${videoOverlay.width}`,
                        gridRow: `${videoOverlay.startRow} / span ${videoOverlay.height}`,
                        background: chromaBackground ? '#00FF00' : 'var(--bg-banner)',
                        borderRadius: roundedCorners ? '0.5rem' : '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: `${Math.min(videoOverlay.width, videoOverlay.height) * 2}rem`,
                      }}
                    >
                      📹
                    </div>
                  )}
                  {teamPlacements.map((placement) => (
                    <div key={placement.originalIndex} style={{ gridColumn: placement.col, gridRow: placement.row }}>
                      {renderBox(placement.teamIndex, placement.originalIndex)}
                    </div>
                  ))}
                </div>
                {hasFooterText && (
                  <div style={{ width: `${gridWidth}px` }}>
                    {footerRow}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
        </div>
        
        {/* Claim Overlay */}
        {claimOverlay && (() => {
          const team = currentTeams[claimOverlay.teamIndex];
          return (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: '1rem',
              background: `linear-gradient(135deg, ${team.primary} 0%, ${team.secondary} 100%)`,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3rem',
              padding: '2rem',
              zIndex: 100,
              animation: 'claimOverlayIn 0.4s ease-out'
            }}>
              {/* Confetti particles */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${0.5 + Math.random() * 0.75}rem`,
                    height: `${0.5 + Math.random() * 0.75}rem`,
                    background: i % 2 === 0 ? '#fff' : (i % 3 === 0 ? team.primary : team.secondary),
                    borderRadius: i % 3 === 0 ? '50%' : '0.125rem',
                    left: `${Math.random() * 100}%`,
                    top: '-1rem',
                    opacity: 0.8,
                    animation: `confettiFall ${1.5 + Math.random() * 1.5}s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.5}s`
                  }}
                />
              ))}
              
              {/* Team Logo - Left Side (hidden in custom mode) */}
              {!isCustomMode && (
                <div style={{
                  width: '12rem',
                  height: '12rem',
                  flexShrink: 0,
                  filter: 'drop-shadow(0 0.5rem 2rem rgba(0,0,0,0.4))',
                  animation: 'logoPopIn 0.5s ease-out 0.2s both'
                }}>
                  <img 
                    src={team.logo} 
                    alt={team.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
              
              {/* Text Content - Right Side */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isCustomMode ? 'center' : 'flex-start',
                gap: '0.25rem'
              }}>
                {/* Team Name */}
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '4rem',
                  fontWeight: 800,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  textShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.3)',
                  animation: 'textSlideIn 0.4s ease-out 0.3s both'
                }}>
                  {team.name}
                </div>
                
                {/* CLAIMED Text */}
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4em',
                  textShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.3)',
                  animation: 'textSlideIn 0.4s ease-out 0.4s both'
                }}>
                  CLAIMED
                </div>
                
                {/* Buyer Name */}
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                  marginTop: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '2rem',
                  animation: 'textSlideIn 0.4s ease-out 0.5s both'
                }}>
                  by {claimOverlay.buyerName}
                </div>
              </div>
            </div>
          );
        })()}
        
        {/* Stream Overlays */}
        {streamOverlay && (() => {
          // Get sport-specific icon for Live overlay
          const sportIcons = { nba: '🏀', mlb: '⚾', nfl: '🏈', custom: '🔥' };
          const liveIcon = sportIcons[category] || '🏀';
          
          const overlayConfigs = {
            live: {
              gradient: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #000000 100%)',
              icon: liveIcon,
              title: 'Live @ $1',
              hasGreenPrice: true
            },
            pyt: {
              gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              icon: '🎯',
              title: 'Pick Your Team'
            },
            stashpass: {
              gradient: 'linear-gradient(135deg, #314417 0%, #1a1a2e 50%, #3f230e 100%)',
              icon: '',
              title: 'OR',
              isStashPass: true
            },
            '2spins': {
              gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #f59e0b 100%)',
              icon: '🎰',
              title: 'Spin 2, Keep 1'
            },
            randomizer: {
              gradient: 'linear-gradient(135deg, #463a14 0%, #1a1a2e 50%, #463a14 100%)',
              icon: '',
              title: '',
              isRandomizer: true
            }
          };
          
          const config = overlayConfigs[streamOverlay];
          if (!config) return null;
          
          // Get remaining (unpurchased) teams for 'live' overlay
          const remainingTeams = streamOverlay === 'live' 
            ? teamOrder.filter((_, idx) => !purchasedTeams[idx]).map(idx => currentTeams[idx])
            : [];
          
          return (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: '1rem',
              background: config.gradient,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              padding: '2rem',
              zIndex: 200,
              animation: streamOverlayFading ? 'overlayFadeOut 1s ease-out forwards' : 'claimOverlayIn 0.4s ease-out',
              overflow: 'hidden'
            }}>
              {/* Animated floating team logos for 'live' overlay */}
              {streamOverlay === 'live' && !isCustomMode && remainingTeams.map((team, i) => {
                // Create a more centered, clustered layout
                const angle = (i / remainingTeams.length) * Math.PI * 2;
                const radius = 15 + (i % 3) * 8;
                const centerX = 50 + Math.cos(angle) * radius;
                const centerY = 50 + Math.sin(angle) * radius;
                
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: '3.5rem',
                      height: '3.5rem',
                      left: `${centerX}%`,
                      top: `${centerY}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: `teamWiggle${i % 6} ${1.5 + (i % 4) * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      opacity: 0.7,
                      filter: 'drop-shadow(0 0.25rem 0.5rem rgba(0,0,0,0.5))'
                    }}
                  >
                    <img 
                      src={team.logo} 
                      alt={team.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                );
              })}
              {/* Animated background elements */}
              {streamOverlay === 'pyt' && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        left: `${(i % 4) * 30 + 5}%`,
                        top: `${Math.floor(i / 4) * 40 + 10}%`,
                        animation: `pytPulse 2s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* Stash/Pass split screen */}
              {streamOverlay === 'stashpass' && (
                <>
                  {/* Left side - Stash (Green) */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    background: '#314417',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'slideInLeft 0.4s ease-out'
                  }}>
                    <div className="stash-pass-text" style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '8rem',
                      fontWeight: 800,
                      color: '#6cec35',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)'
                    }}>STASH</div>
                  </div>
                  
                  {/* Right side - Pass (Red) */}
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '50%',
                    background: '#3f230e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'slideInRight 0.4s ease-out'
                  }}>
                    <div className="stash-pass-text" style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '8rem',
                      fontWeight: 800,
                      color: '#ff4e00',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      textShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)'
                    }}>PASS</div>
                  </div>
                </>
              )}
              
              {/* Randomizer overlay - Slot Machine Style */}
              
              {/* Randomizer - Custom Mode */}
              {streamOverlay === 'randomizer' && isCustomMode && (() => {
                const columns = 5;
                
                // Generate random vibrant colors for slot machine
                const generateRandomColor = (seed) => {
                  const hue = (seed * 137.5) % 360; // Golden angle for good distribution
                  const saturation = 60 + (seed * 7) % 30; // 60-90%
                  const lightness = 45 + (seed * 11) % 20; // 45-65%
                  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                };
                
                // Create array of color pairs for gradients
                const colorPairs = Array.from({ length: 20 }, (_, i) => ({
                  primary: generateRandomColor(i * 3),
                  secondary: generateRandomColor(i * 3 + 1)
                }));
                
                return (
                  <>
                    {/* Slot machine reels */}
                    {[...Array(columns)].map((_, colIndex) => (
                      <div
                        key={colIndex}
                        style={{
                          position: 'absolute',
                          left: `${12 + colIndex * 16}%`,
                          top: 'calc(20% - 0.5rem)',
                          width: '12%',
                          height: '60%',
                          overflow: 'hidden',
                          border: '0.25rem solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 0,
                          background: 'rgba(0, 0, 0, 0.4)'
                        }}
                      >
                        {/* Spinning column of random colors */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            animation: `slotSpin ${2 + colIndex * 0.3}s linear infinite`,
                            position: 'relative'
                          }}
                        >
                          {/* Repeat colors multiple times for seamless loop */}
                          {[...Array(4)].map((_, repeatIndex) => (
                            colorPairs.map((colors, colorIndex) => (
                              <div
                                key={`${repeatIndex}-${colorIndex}`}
                                style={{
                                  width: '100%',
                                  height: '6rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                                  borderBottom: '0.125rem solid rgba(255, 255, 255, 0.2)',
                                  boxSizing: 'border-box'
                                }}
                              />
                            ))
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading bar container - centered (accounting for bottom gap) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: 'calc(50% - 0.5rem)',
                        transform: 'translate(-50%, -50%)',
                        width: '60%',
                        height: '2.5rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '0.25rem solid #ffd401',
                        borderRadius: 0,
                        pointerEvents: 'none',
                        boxShadow: '0 0 1.5rem rgba(255, 212, 1, 0.6)',
                        zIndex: 10,
                        overflow: 'hidden'
                      }}
                    >
                      {/* Loading bar fill */}
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #ffd401 0%, #ffed4e 50%, #ffd401 100%)',
                          transformOrigin: 'left',
                          animation: 'loadingBarFill 2s linear forwards',
                          boxShadow: '0 0 1rem rgba(255, 212, 1, 0.8)'
                        }}
                      />
                    </div>
                  </>
                );
              })()}
              
              {/* Randomizer - Sports Mode */}
              {streamOverlay === 'randomizer' && !isCustomMode && (() => {
                const availableTeamsList = teamOrder.filter(idx => !purchasedTeams[idx]).map(idx => currentTeams[idx]);
                const columns = 5;
                
                return (
                  <>
                    {/* Slot machine reels */}
                    {[...Array(columns)].map((_, colIndex) => (
                      <div
                        key={colIndex}
                        style={{
                          position: 'absolute',
                          left: `${12 + colIndex * 16}%`,
                          top: 'calc(20% - 0.5rem)',
                          width: '12%',
                          height: '60%',
                          overflow: 'hidden',
                          border: '0.25rem solid rgba(255, 255, 255, 0.3)',
                          borderRadius: 0,
                          background: 'rgba(0, 0, 0, 0.4)'
                        }}
                      >
                        {/* Spinning column of team colors */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            animation: `slotSpin ${2 + colIndex * 0.3}s linear infinite`,
                            position: 'relative'
                          }}
                        >
                          {/* Repeat teams multiple times for seamless loop */}
                          {[...Array(4)].map((_, repeatIndex) => (
                            availableTeamsList.map((team, teamIndex) => (
                              <div
                                key={`${repeatIndex}-${teamIndex}`}
                                style={{
                                  width: '100%',
                                  height: '6rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: `linear-gradient(135deg, ${team.primary} 0%, ${team.secondary} 100%)`,
                                  borderBottom: '0.125rem solid rgba(255, 255, 255, 0.2)',
                                  boxSizing: 'border-box'
                                }}
                              />
                            ))
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading bar container - centered (accounting for bottom gap) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: 'calc(50% - 0.5rem)',
                        transform: 'translate(-50%, -50%)',
                        width: '60%',
                        height: '2.5rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        border: '0.25rem solid #ffd401',
                        borderRadius: 0,
                        pointerEvents: 'none',
                        boxShadow: '0 0 1.5rem rgba(255, 212, 1, 0.6)',
                        zIndex: 10,
                        overflow: 'hidden'
                      }}
                    >
                      {/* Loading bar fill */}
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #ffd401 0%, #ffed4e 50%, #ffd401 100%)',
                          transformOrigin: 'left',
                          animation: 'loadingBarFill 2s linear forwards',
                          boxShadow: '0 0 1rem rgba(255, 212, 1, 0.8)'
                        }}
                      />
                    </div>
                  </>
                );
              })()}
              
              
              {streamOverlay === '2spins' && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        width: '3rem',
                        height: '3rem',
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        borderRadius: 0,
                        left: `${10 + (i % 4) * 25}%`,
                        top: `${20 + Math.floor(i / 4) * 50}%`,
                        animation: `spinBounce 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.1}s`,
                        transform: 'rotate(45deg)'
                      }}
                    />
                  ))}
                </>
              )}
              
              {/* Confetti */}
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${0.5 + Math.random() * 0.5}rem`,
                    height: `${0.5 + Math.random() * 0.5}rem`,
                    background: ['#fe68ff', '#ffd401', '#6cec35', '#2bc2ff', '#ff4e00'][i % 5],
                    borderRadius: i % 3 === 0 ? '50%' : '0.125rem',
                    left: `${Math.random() * 100}%`,
                    top: '-1rem',
                    opacity: 0.9,
                    animation: `confettiFall ${2 + Math.random() * 2}s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.8}s`
                  }}
                />
              ))}
              
              {/* Icon - Left Side */}
              {!config.isRandomizer && (
                <div className="stream-overlay-icon" style={{
                  fontSize: '6rem',
                  animation: 'logoPopIn 0.5s ease-out 0.2s both',
                  filter: 'drop-shadow(0 0.5rem 1rem rgba(0,0,0,0.4))'
                }}>
                  {config.icon}
                </div>
              )}
              
              {/* Text - Center */}
              {!config.isRandomizer && (
                <div className="stream-overlay-title" style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '5rem',
                  fontWeight: 800,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  textShadow: '0 0.25rem 0.5rem rgba(0,0,0,0.4), 0 0 2rem rgba(255,255,255,0.2)',
                  animation: 'textSlideIn 0.4s ease-out 0.3s both'
                }}>
                  {config.hasGreenPrice ? (
                    <>Live @ <span style={{ color: '#6cec35' }}>$1</span></>
                  ) : config.title}
                </div>
              )}
              
              {/* Icon - Right Side */}
              {!config.isRandomizer && (
                <div className="stream-overlay-icon" style={{
                  fontSize: '6rem',
                  animation: 'logoPopIn 0.5s ease-out 0.4s both',
                  filter: 'drop-shadow(0 0.5rem 1rem rgba(0,0,0,0.4))'
                }}>
                  {config.icon}
                </div>
              )}
            </div>
          );
        })()}
        
        {/* Drag Handle */}
        <div 
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="drag-handle"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1rem',
            cursor: 'ns-resize',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: isDragging ? 'var(--drag-handle-active)' : 'var(--drag-handle-bg)',
            borderTop: '1px solid var(--drag-handle-border)',
            transition: 'background 0.15s ease'
          }}
        >
          <div style={{
            width: '5rem',
            height: '0.3125rem',
            borderRadius: 0,
            background: isDragging ? 'var(--accent)' : 'var(--drag-handle-pill)',
            transition: 'background 0.15s ease'
          }} />
        </div>
      </div>

      <div className={`main-container ${!mobileSceneHidden ? 'scene-visible' : ''}`} style={{ marginTop: `${sceneHeight}rem`, height: `calc(100vh - ${sceneHeight}rem)` }}>
        {/* Content Area with Tabs */}
        <main className="content-area">
          <nav className="tab-navigation">
            <div className="nav-left">
              <div className="logo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="480 180 400 400" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <rect fill="#fff" x="631.42" y="332.45" width="103.16" height="103.16"/>
                  <polygon fill="#fff" points="608.07 207.38 608.07 310.55 504.91 310.55 504.91 271.45 568.97 207.38 608.07 207.38"/>
                  <polygon fill="#fff" points="504.91 332.42 608.07 332.42 608.07 435.58 568.97 435.58 504.91 371.52 504.91 332.42"/>
                  <polygon fill="#fff" points="504.91 457.52 608.07 457.52 608.07 560.68 568.97 560.68 504.91 496.62 504.91 457.52"/>
                  <polygon fill="#fff" points="757.93 560.68 757.93 457.52 861.09 457.52 861.09 496.62 797.03 560.68 757.93 560.68"/>
                  <polygon fill="#fff" points="861.09 435.58 757.93 435.58 757.93 332.42 797.03 332.42 861.09 396.48 861.09 435.58"/>
                  <polygon fill="#fff" points="861.09 310.48 757.93 310.48 757.93 207.32 797.03 207.32 861.09 271.38 861.09 310.48"/>
                  <rect fill="#fff" x="631.42" y="207.38" width="103.16" height="103.16"/>
                  <rect fill="#fff" x="631.42" y="457.52" width="103.16" height="103.16"/>
                </svg>
                <span>StreamSlot</span>
                <span style={{ 
                  fontSize: '0.6875rem', 
                  color: 'var(--text-muted)',
                  padding: '0.125rem 0.375rem',
                  background: '#2a2a2a',
                  borderRadius: '0.25rem',
                  marginLeft: '0.5rem'
                }}>
                  v0.9 Beta
                </span>
              </div>
              
              {SHOW_SPONSOR && (
                <div className="sponsor-badge">
                  <span>Sponsored by</span>
                  <a 
                    href="https://sponsor-website.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="sponsor-badge-name"
                    style={{
                      textDecoration: 'none',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    {/* Sponsor name/logo goes here */}
                    Sponsor Name
                  </a>
                </div>
              )}
            </div>
            
            <div className="tab-buttons">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            
            <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setShowResetConfirm(true)}
                style={{
                  height: '2.5rem',
                  padding: '0 0.875rem',
                  borderRadius: 0,
                  border: 'none',
                  background: '#3f230e',
                  color: '#ff4e00',
                  fontFamily: 'inherit',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                <span>↺</span>
                <span>Reset Board</span>
              </button>
            </div>
          </nav>

          {/* Mobile Scene Toggle Button */}
          <button 
            className="mobile-scene-toggle"
            onClick={() => setMobileSceneHidden(!mobileSceneHidden)}
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 1rem',
              marginBottom: '1rem',
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              background: mobileSceneHidden ? '#2a2a2a' : '#442544',
              color: mobileSceneHidden ? '#888888' : '#fe68ff',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}
          >
            <span>{mobileSceneHidden ? '👁️ Show Scene Preview' : '👁️‍🗨️ Hide Scene Preview'}</span>
          </button>

          <div className="tab-content" key={activeTab}>
            {tabContent[activeTab]}
          </div>
          
          {/* Ad Space */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div 
              className="sponsor-footer"
              style={{
                width: '728px',
                height: '90px',
                maxWidth: '100%',
                background: '#2a2a2a',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* AdSense code goes here */}
            </div>
          </div>
          
          {/* Global Footer */}
          <footer className="global-footer" style={{
            borderTop: '1px solid var(--border-color-inner)',
            padding: '1.5rem 1.5rem',
            marginTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {/* Top Row: Logo/Name/Version and Blurb */}
            <div className="footer-top-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div className="footer-logo-section" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="480 180 400 400" style={{ width: '1.5rem', height: '1.5rem', flexShrink: 0 }}>
                  <rect fill="#fff" x="631.42" y="332.45" width="103.16" height="103.16"/>
                  <polygon fill="#fff" points="608.07 207.38 608.07 310.55 504.91 310.55 504.91 271.45 568.97 207.38 608.07 207.38"/>
                  <polygon fill="#fff" points="504.91 332.42 608.07 332.42 608.07 435.58 568.97 435.58 504.91 371.52 504.91 332.42"/>
                  <polygon fill="#fff" points="504.91 457.52 608.07 457.52 608.07 560.68 568.97 560.68 504.91 496.62 504.91 457.52"/>
                  <polygon fill="#fff" points="757.93 560.68 757.93 457.52 861.09 457.52 861.09 496.62 797.03 560.68 757.93 560.68"/>
                  <polygon fill="#fff" points="861.09 435.58 757.93 435.58 757.93 332.42 797.03 332.42 861.09 396.48 861.09 435.58"/>
                  <polygon fill="#fff" points="861.09 310.48 757.93 310.48 757.93 207.32 797.03 207.32 861.09 271.38 861.09 310.48"/>
                  <rect fill="#fff" x="631.42" y="207.38" width="103.16" height="103.16"/>
                  <rect fill="#fff" x="631.42" y="457.52" width="103.16" height="103.16"/>
                </svg>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontFamily: "'Space Mono', monospace", 
                    fontWeight: 700, 
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    StreamSlot
                  </span>
                  <span style={{ 
                    fontSize: '0.6875rem', 
                    color: 'var(--text-muted)',
                    padding: '0.125rem 0.375rem',
                    background: '#2a2a2a',
                    borderRadius: '0.25rem'
                  }}>
                    v0.9 Beta
                  </span>
                </div>
              </div>
              <span className="footer-blurb" style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                lineHeight: 1.4,
                textAlign: 'right'
              }}>
                A free tool built for card streamers to manage box breaks.
              </span>
            </div>
            
            {/* Bottom Row: Resources and Social Icons */}
            <div className="footer-bottom-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div className="footer-resources" style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>Resources:</span>
                <a 
                  href="https://example.com/link1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Card Supplies
                </a>
                <span>•</span>
                <a 
                  href="https://example.com/link2" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Breaker Cases
                </a>
                <span>•</span>
                <a 
                  href="https://example.com/link3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Team Bags
                </a>
              </div>
              
              {/* Social Media Links */}
              <div className="footer-social" style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <a 
                  href="https://youtube.com/@yourhandle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Youtube
                </a>
                <span>•</span>
                <a 
                  href="https://twitter.com/yourhandle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  X
                </a>
                <span>•</span>
                <a 
                  href="https://discord.gg/yourserver" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Discord
                </a>
                <span>•</span>
                <a 
                  href="https://tiktok.com/@yourhandle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  Tiktok
                </a>
                <span>•</span>
                <a 
                  href="https://whatnot.com/yourhandle" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  WhatNot
                </a>
              </div>
            </div>
            
            {/* Sponsored by - Controlled by SHOW_SPONSOR toggle */}
            {SHOW_SPONSOR && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginTop: '0.5rem'
              }}>
                <span>Sponsored by</span>
                <a 
                  href="https://sponsor-website.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {/* Sponsor name/logo goes here */}
                  Sponsor Name
                </a>
              </div>
            )}
          </footer>
          
          {/* Reset Confirmation Modal */}
          {showResetConfirm && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              animation: 'claimOverlayIn 0.2s ease-out',
              borderRadius: 0
            }}>
              <div style={{
                background: 'var(--bg-panel)',
                borderRadius: 0,
                padding: '2rem',
                maxWidth: '32rem',
                width: '90%',
                border: '1px solid var(--border-color-inner)',
                boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#ff4e00',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>⚠️</span>
                  <span>Reset Board?</span>
                </div>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  marginBottom: '0.5rem'
                }}>
                  This will clear all purchased teams and wipe the board clean. Box number will automatically increase by 1. This action cannot be undone.
                </p>
                
                <p style={{
                  color: '#888',
                  fontSize: '0.75rem',
                  fontStyle: 'italic',
                  lineHeight: 1.5,
                  marginBottom: '1.5rem'
                }}>
                  Tip: Export & Reset button below will save a CSV before clearing (optional).
                </p>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    style={{
                      flex: 1,
                      height: '2.5rem',
                      padding: '0 1rem',
                      borderRadius: 0,
                      border: '1px solid var(--border-color-inner)',
                      background: '#2a2a2a',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExportAndReset}
                    style={{
                      flex: 1,
                      height: '2.5rem',
                      padding: '0 1rem',
                      borderRadius: 0,
                      border: 'none',
                      background: '#314417',
                      color: '#6cec35',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    Export & Reset
                  </button>
                  <button
                    onClick={handleResetBoard}
                    style={{
                      flex: 1,
                      height: '2.5rem',
                      padding: '0 1rem',
                      borderRadius: 0,
                      border: 'none',
                      background: '#3f230e',
                      color: '#ff4e00',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    Reset Board
                  </button>
                </div>
                
                {/* Reset Modal Sponsor Space */}
                <div style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div 
                    className="sponsor-modal"
                    style={{
                      width: '468px',
                      height: '60px',
                      maxWidth: '100%',
                      background: 'var(--bg-panel)',
                      borderRadius: 0,
                      border: '1px solid var(--border-color-inner)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}
                  >
                    {/* AdSense code goes here */}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Category Change Confirmation Dialog */}
          {showCategoryConfirm && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              animation: 'claimOverlayIn 0.2s ease-out',
              borderRadius: 0
            }}>
              <div style={{
                background: 'var(--bg-panel)',
                borderRadius: 0,
                padding: '2rem',
                maxWidth: '32rem',
                width: '90%',
                border: '1px solid var(--border-color-inner)',
                boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.4)'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#ffd401',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>⚠️</span>
                  <span>Change Category?</span>
                </div>
                
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}>
                  Changing categories will <strong>clear all purchased teams</strong> and reset the board. This action cannot be undone.
                </p>
                
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setShowCategoryConfirm(false);
                      setPendingCategory(null);
                    }}
                    style={{
                      flex: 1,
                      height: '2.5rem',
                      padding: '0 1rem',
                      borderRadius: 0,
                      border: '1px solid var(--border-color-inner)',
                      background: '#2a2a2a',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      executeCategoryChange(pendingCategory);
                      setShowCategoryConfirm(false);
                      setPendingCategory(null);
                    }}
                    style={{
                      flex: 1,
                      height: '2.5rem',
                      padding: '0 1rem',
                      borderRadius: 0,
                      border: 'none',
                      background: '#463a14',
                      color: '#ffd401',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    Change Category
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LayoutContent({ columns, setColumns, category, handleCategoryChange, shuffleTeams, spacing, setSpacing, squareBoxes, setSquareBoxes, showLabels, setShowLabels, roundedCorners, setRoundedCorners, borders, setBorders, swapColors, setSwapColors, chromaBackground, setChromaBackground, sceneTextColor, setSceneTextColor, boxName, setBoxName, boxNumber, setBoxNumber, sceneNote, setSceneNote, showBoxName, setShowBoxName, showBoxNumber, setShowBoxNumber, showSceneNote, setShowSceneNote, showSlotCount, setShowSlotCount, slotCounterText, setSlotCounterText, sceneTextSize, setSceneTextSize, boxes, purchasedTeams, availableCount, isCustomMode, customSlots, addCustomSlots, removeCustomSlot, clearCustomSlots, customSlotsHeight, handleCustomSlotsDragStart, isCustomSlotsDragging, videoOverlay, setVideoOverlay }) {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsed ? 0 : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                background: '#2a2a2a',
                color: '#888888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                transition: 'transform 0.2s ease'
              }}
            >
              <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{collapsed ? '+' : '−'}</span>
            </button>
            <div className="section-title" style={{ marginBottom: 0 }}>Layout</div>
            <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center', flex: 1 }}>
              <button
                onClick={() => handleCategoryChange('nba')}
                style={{
                  height: '2rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: category === 'nba' 
                    ? '#442544' 
                    : '#2a2a2a',
                  color: category === 'nba' ? '#fe68ff' : '#888888',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <span>🏀</span>
                <span className="category-text">NBA</span>
              </button>
              <button
                onClick={() => handleCategoryChange('mlb')}
                style={{
                  height: '2rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: category === 'mlb' 
                    ? '#442544' 
                    : '#2a2a2a',
                  color: category === 'mlb' ? '#fe68ff' : '#888888',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <span>⚾</span>
                <span className="category-text">MLB</span>
              </button>
              <button
                onClick={() => handleCategoryChange('nfl')}
                style={{
                  height: '2rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: category === 'nfl' 
                    ? '#442544' 
                    : '#2a2a2a',
                  color: category === 'nfl' ? '#fe68ff' : '#888888',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <span>🏈</span>
                <span className="category-text">NFL</span>
              </button>
              <button
                onClick={() => handleCategoryChange('custom')}
                style={{
                  height: '2rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: category === 'custom' 
                    ? '#442544' 
                    : '#2a2a2a',
                  color: category === 'custom' ? '#fe68ff' : '#888888',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <span>✏️</span>
                <span className="category-text">Custom</span>
              </button>
              
              {/* Chroma Button - Green styling */}
              <button 
                onClick={() => setChromaBackground(!chromaBackground)}
                style={{
                  height: '2rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: chromaBackground ? '#314417' : '#2a2a2a',
                  color: chromaBackground ? '#6cec35' : '#888888',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'none',
                  marginLeft: 'auto'
                }}
              >
                <span>CHROMA</span>
              </button>
              
              {/* Shuffle Button - Right Aligned */}
              <button 
                onClick={shuffleTeams}
                style={{
                  height: '2rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: '#463a14',
                  color: '#ffd401',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  transition: 'transform 0.1s ease',
                  boxShadow: 'none'
                }}
                onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                <span>⇄</span>
                <span>SHUFFLE</span>
              </button>
            </div>
          </div>
        </div>
        
        {!collapsed && (
        <div className="layout-controls-grid">
          {/* Column 1: Sliders */}
          <div>
            {/* Columns */}
            <div className="control-item">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◈</span>
              <span className="control-label">Columns</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto', alignItems: 'center' }}>
                <button
                  onClick={() => setColumns(Math.max(2, columns - 1))}
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: 0,
                    border: 'none',
                    background: '#2a2a2a',
                    color: '#7dd3e0',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#213338'}
                  onMouseLeave={(e) => e.target.style.background = '#2a2a2a'}
                >
                  −
                </button>
                <span style={{ 
                  fontFamily: 'Space Mono, monospace', 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  color: '#fff',
                  minWidth: '2rem',
                  textAlign: 'center'
                }}>
                  {columns}
                </span>
                <button
                  onClick={() => setColumns(Math.min(16, columns + 1))}
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: 0,
                    border: 'none',
                    background: '#2a2a2a',
                    color: '#7dd3e0',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#213338'}
                  onMouseLeave={(e) => e.target.style.background = '#2a2a2a'}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Spacing */}
            <div className="control-item">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>⊞</span>
              <span className="control-label">Spacing</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto', alignItems: 'center' }}>
                <button
                  onClick={() => setSpacing(Math.max(0, Number((spacing - 0.1).toFixed(1))))}
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: 0,
                    border: 'none',
                    background: '#2a2a2a',
                    color: '#7dd3e0',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#213338'}
                  onMouseLeave={(e) => e.target.style.background = '#2a2a2a'}
                >
                  −
                </button>
                <span style={{ 
                  fontFamily: 'Space Mono, monospace', 
                  fontSize: '0.875rem', 
                  fontWeight: 600,
                  color: '#fff',
                  minWidth: '2rem',
                  textAlign: 'center'
                }}>
                  {spacing}
                </span>
                <button
                  onClick={() => setSpacing(Math.min(2, Number((spacing + 0.1).toFixed(1))))}
                  style={{
                    width: '1.75rem',
                    height: '1.75rem',
                    borderRadius: 0,
                    border: 'none',
                    background: '#2a2a2a',
                    color: '#7dd3e0',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    boxShadow: 'none'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#213338'}
                  onMouseLeave={(e) => e.target.style.background = '#2a2a2a'}
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
          {/* Column 2: Toggles */}
          <div>
            {/* Square Slots */}
            <div className="control-item" style={{ opacity: isCustomMode ? 0.5 : 1, pointerEvents: isCustomMode ? 'none' : 'auto' }}>
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◻</span>
              <span className="control-label">Square Slots</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button 
                  onClick={() => setSquareBoxes(false)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: !squareBoxes ? '#3f230e' : '#2a2a2a',
                    color: !squareBoxes ? '#ff4e00' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: !squareBoxes ? 'none' : 'none'
                  }}
                >
                  OFF
                </button>
                <button 
                  onClick={() => setSquareBoxes(true)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: squareBoxes ? '#314417' : '#2a2a2a',
                    color: squareBoxes ? '#6cec35' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: squareBoxes ? 'none' : 'none'
                  }}
                >
                  ON
                </button>
              </div>
            </div>
            
            {/* Show Labels */}
            <div className="control-item" style={{ opacity: isCustomMode ? 0.5 : 1, pointerEvents: isCustomMode ? 'none' : 'auto' }}>
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>Aa</span>
              <span className="control-label">Show Labels</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button 
                  onClick={() => setShowLabels(false)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: !showLabels ? '#3f230e' : '#2a2a2a',
                    color: !showLabels ? '#ff4e00' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: !showLabels ? 'none' : 'none'
                  }}
                >
                  OFF
                </button>
                <button 
                  onClick={() => setShowLabels(true)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: showLabels ? '#314417' : '#2a2a2a',
                    color: showLabels ? '#6cec35' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: showLabels ? 'none' : 'none'
                  }}
                >
                  ON
                </button>
              </div>
            </div>
          </div>
          
          {/* Column 3: Borders & Rounded Edge */}
          <div>
            {/* Borders */}
            <div className="control-item" style={{ opacity: isCustomMode ? 0.5 : 1, pointerEvents: isCustomMode ? 'none' : 'auto' }}>
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>▢</span>
              <span className="control-label">Borders</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button 
                  onClick={() => setBorders(false)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: !borders ? '#3f230e' : '#2a2a2a',
                    color: !borders ? '#ff4e00' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: !borders ? 'none' : 'none'
                  }}
                >
                  OFF
                </button>
                <button 
                  onClick={() => setBorders(true)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: borders ? '#314417' : '#2a2a2a',
                    color: borders ? '#6cec35' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: borders ? 'none' : 'none'
                  }}
                >
                  ON
                </button>
              </div>
            </div>
            
            {/* Rounded Edge */}
            <div className="control-item">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◢</span>
              <span className="control-label">Rounded Edge</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button 
                  onClick={() => setRoundedCorners(false)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: !roundedCorners ? '#3f230e' : '#2a2a2a',
                    color: !roundedCorners ? '#ff4e00' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: !roundedCorners ? 'none' : 'none'
                  }}
                >
                  OFF
                </button>
                <button 
                  onClick={() => setRoundedCorners(true)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: roundedCorners ? '#314417' : '#2a2a2a',
                    color: roundedCorners ? '#6cec35' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: roundedCorners ? 'none' : 'none'
                  }}
                >
                  ON
                </button>
              </div>
            </div>
          </div>
          
          {/* Column 4: Swap Colors & Randomize */}
          <div>
            {/* Swap Colors */}
            <div className="control-item" style={{ opacity: isCustomMode ? 0.5 : 1, pointerEvents: isCustomMode ? 'none' : 'auto' }}>
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>⇄</span>
              <span className="control-label">Swap Colors</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button 
                  onClick={() => setSwapColors(false)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: !swapColors ? '#3f230e' : '#2a2a2a',
                    color: !swapColors ? '#ff4e00' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: !swapColors ? 'none' : 'none'
                  }}
                >
                  OFF
                </button>
                <button 
                  onClick={() => setSwapColors(true)}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: swapColors ? '#314417' : '#2a2a2a',
                    color: swapColors ? '#6cec35' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: swapColors ? 'none' : 'none'
                  }}
                >
                  ON
                </button>
              </div>
            </div>
            
            {/* Dark Text */}
            <div className="control-item">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>A</span>
              <span className="control-label">Dark Text</span>
              <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
                <button 
                  onClick={() => setSceneTextColor('light')}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: sceneTextColor === 'light' ? '#3f230e' : '#2a2a2a',
                    color: sceneTextColor === 'light' ? '#ff4e00' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'none'
                  }}
                >
                  OFF
                </button>
                <button 
                  onClick={() => setSceneTextColor('dark')}
                  style={{
                    height: '1.5rem',
                    padding: '0 0.5rem',
                    borderRadius: 0,
                    border: 'none',
                    background: sceneTextColor === 'dark' ? '#314417' : '#2a2a2a',
                    color: sceneTextColor === 'dark' ? '#6cec35' : '#888888',
                    fontFamily: 'inherit',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'none'
                  }}
                >
                  ON
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      
      {/* Video Overlay Box */}
      <VideoOverlayContent videoOverlay={videoOverlay} setVideoOverlay={setVideoOverlay} columns={columns} boxes={boxes} />
      
      {/* Scene Text Box */}
      <SceneTextContent boxName={boxName} setBoxName={setBoxName} boxNumber={boxNumber} setBoxNumber={setBoxNumber} sceneNote={sceneNote} setSceneNote={setSceneNote} showBoxName={showBoxName} setShowBoxName={setShowBoxName} showBoxNumber={showBoxNumber} setShowBoxNumber={setShowBoxNumber} showSceneNote={showSceneNote} setShowSceneNote={setShowSceneNote} showSlotCount={showSlotCount} setShowSlotCount={setShowSlotCount} slotCounterText={slotCounterText} setSlotCounterText={setSlotCounterText} sceneTextSize={sceneTextSize} setSceneTextSize={setSceneTextSize} boxes={boxes} />
      
      {/* Custom Slots Box - only shown when custom mode is active */}
      {isCustomMode && (
        <div style={{ marginTop: '1rem' }}>
          <CustomSlotsContent customSlots={customSlots} addCustomSlots={addCustomSlots} removeCustomSlot={removeCustomSlot} clearCustomSlots={clearCustomSlots} customSlotsHeight={customSlotsHeight} handleCustomSlotsDragStart={handleCustomSlotsDragStart} isCustomSlotsDragging={isCustomSlotsDragging} />
        </div>
      )}
    </div>
  );
}

function SceneTextContent({ boxName, setBoxName, boxNumber, setBoxNumber, sceneNote, setSceneNote, showBoxName, setShowBoxName, showBoxNumber, setShowBoxNumber, showSceneNote, setShowSceneNote, showSlotCount, setShowSlotCount, slotCounterText, setSlotCounterText, sceneTextSize, setSceneTextSize, boxes }) {
  const [collapsed, setCollapsed] = useState(false);
  
  // Reusable toggle button component
  const ToggleButtons = ({ value, setValue }) => (
    <div style={{ display: 'flex', gap: '0.25rem', marginLeft: 'auto' }}>
      <button 
        onClick={() => setValue(false)}
        style={{
          height: '1.5rem',
          padding: '0 0.5rem',
          borderRadius: 0,
          border: 'none',
          background: !value ? '#3f230e' : '#2a2a2a',
          color: !value ? '#ff4e00' : '#888888',
          fontFamily: 'inherit',
          fontSize: '0.625rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'none',
          boxSizing: 'border-box'
        }}
      >
        OFF
      </button>
      <button 
        onClick={() => setValue(true)}
        style={{
          height: '1.5rem',
          padding: '0 0.5rem',
          borderRadius: 0,
          border: 'none',
          background: value ? '#314417' : '#2a2a2a',
          color: value ? '#6cec35' : '#888888',
          fontFamily: 'inherit',
          fontSize: '0.625rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: 'none',
          boxSizing: 'border-box'
        }}
      >
        ON
      </button>
    </div>
  );
  
  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsed ? 0 : '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              background: '#2a2a2a',
              color: '#888888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              transition: 'transform 0.2s ease'
            }}
          >
            <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{collapsed ? '+' : '−'}</span>
          </button>
          <div className="section-title" style={{ marginBottom: 0 }}>Text</div>
          
          {/* Font Size Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem' }}>
            {['S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                onClick={() => setSceneTextSize(size)}
                style={{
                  height: '1.5rem',
                    padding: '0 0.5rem',
                  borderRadius: 0,
                  border: 'none',
                  background: sceneTextSize === size 
                    ? '#442544' 
                    : '#2a2a2a',
                  color: sceneTextSize === size ? '#fe68ff' : '#888888',
                  fontFamily: 'inherit',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '1.75rem'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {!collapsed && (
        <div className="layout-controls-grid">
          {/* Column 1: Box Name */}
          <div>
            <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◼</span>
                <span className="control-label">Box Name</span>
                <ToggleButtons value={showBoxName} setValue={setShowBoxName} />
              </div>
              <input
                type="text"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                placeholder="Enter box name..."
                disabled={!showBoxName}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: showBoxName ? 1 : 0.5
                }}
              />
            </div>
          </div>
          
          {/* Column 2: Box Number */}
          <div>
            <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>#</span>
                <span className="control-label">Box Number</span>
                <ToggleButtons value={showBoxNumber} setValue={setShowBoxNumber} />
              </div>
              <input
                type="text"
                value={boxNumber}
                onChange={(e) => setBoxNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter box #..."
                disabled={!showBoxNumber}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: showBoxNumber ? 1 : 0.5
                }}
              />
            </div>
          </div>
          
          {/* Column 3: Scene Note */}
          <div>
            <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>✎</span>
                <span className="control-label">Scene Note</span>
                <ToggleButtons value={showSceneNote} setValue={setShowSceneNote} />
              </div>
              <input
                type="text"
                value={sceneNote}
                onChange={(e) => setSceneNote(e.target.value)}
                placeholder="HOBBY BOX, GIVEAWAY..."
                disabled={!showSceneNote}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: showSceneNote ? 1 : 0.5
                }}
              />
            </div>
          </div>
          
          {/* Column 4: Slot Counter */}
          <div>
            <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◫</span>
                <span className="control-label">Slot Counter</span>
                <ToggleButtons value={showSlotCount} setValue={setShowSlotCount} />
              </div>
              <input
                type="text"
                value={slotCounterText}
                onChange={(e) => setSlotCounterText(e.target.value)}
                placeholder="AVAILABLE, SLOTS..."
                disabled={!showSlotCount}
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: showSlotCount ? 1 : 0.5
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VideoOverlayContent({ videoOverlay, setVideoOverlay, columns, boxes }) {
  const [manualCollapsed, setManualCollapsed] = useState(false);
  
  // When OFF, always collapsed. When ON, respect manual collapsed state
  const isCollapsed = !videoOverlay.enabled || manualCollapsed;
  
  // Calculate constraints based on current columns
  const maxWidth = Math.max(1, columns - 1);
  const maxHeight = 5;
  const maxStartCol = Math.max(1, columns - videoOverlay.width + 1);
  
  // Calculate total rows needed
  const baseRows = Math.ceil(boxes / columns);
  const maxStartRow = Math.max(1, baseRows);
  
  // Auto-clamp values when columns change
  const updateVideoOverlay = (updates) => {
    const newState = { ...videoOverlay, ...updates };
    
    // Clamp width first
    newState.width = Math.min(newState.width, columns - 1);
    newState.width = Math.max(1, newState.width);
    
    // Then clamp startCol based on new width
    const newMaxStartCol = columns - newState.width + 1;
    newState.startCol = Math.min(newState.startCol, newMaxStartCol);
    newState.startCol = Math.max(1, newState.startCol);
    
    // Clamp height
    newState.height = Math.min(newState.height, maxHeight);
    newState.height = Math.max(1, newState.height);
    
    // Clamp startRow
    newState.startRow = Math.max(1, newState.startRow);
    
    setVideoOverlay(newState);
  };
  
  // Handle enable toggle - expand when turning ON
  const handleEnableToggle = (enabled) => {
    if (enabled) {
      setManualCollapsed(false); // Expand when turning ON
    }
    updateVideoOverlay({ enabled });
  };
  
  // Calculate slots occupied
  const slotsOccupied = videoOverlay.width * videoOverlay.height;
  
  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCollapsed ? 0 : '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => videoOverlay.enabled && setManualCollapsed(!manualCollapsed)}
            style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              background: '#2a2a2a',
              color: '#888888',
              cursor: videoOverlay.enabled ? 'pointer' : 'default',
              opacity: videoOverlay.enabled ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              transition: 'transform 0.2s ease'
            }}
          >
            <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{isCollapsed ? '+' : '−'}</span>
          </button>
          <div className="section-title" style={{ marginBottom: 0 }}>Overlay</div>
          
          {/* Enable/Disable Toggle - next to title */}
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              onClick={() => handleEnableToggle(false)}
              style={{
                height: '1.5rem',
                    padding: '0 0.5rem',
                borderRadius: 0,
                border: 'none',
                background: !videoOverlay.enabled ? '#3f230e' : '#2a2a2a',
                color: !videoOverlay.enabled ? '#ff4e00' : '#888888',
                fontFamily: 'inherit',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              OFF
            </button>
            <button 
              onClick={() => handleEnableToggle(true)}
              style={{
                height: '1.5rem',
                    padding: '0 0.5rem',
                borderRadius: 0,
                border: 'none',
                background: videoOverlay.enabled ? '#314417' : '#2a2a2a',
                color: videoOverlay.enabled ? '#6cec35' : '#888888',
                fontFamily: 'inherit',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ON
            </button>
          </div>
        </div>
        
        {/* Work in Progress label - right side */}
        <span style={{ 
          fontSize: '0.6875rem', 
          color: '#888', 
          fontStyle: 'italic',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Work in Progress
        </span>
      </div>
      
      {!isCollapsed && (
        <div className="video-overlay-grid">{/* Position Controls */}
          <div className="video-overlay-section">
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</div>
            
            {/* Start Row */}
            <div className="video-control-row">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0', width: '1.5rem', height: '1.5rem', fontSize: '0.75rem' }}>↓</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', flex: 1 }}>Row</span>
              <select
                value={videoOverlay.startRow}
                onChange={(e) => updateVideoOverlay({ startRow: parseInt(e.target.value) })}
                style={{
                  height: '2rem',
                  padding: '0 0.5rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '3.5rem',
                  boxSizing: 'border-box'
                }}
              >
                {[...Array(maxStartRow)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            
            {/* Start Column */}
            <div className="video-control-row">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0', width: '1.5rem', height: '1.5rem', fontSize: '0.75rem' }}>→</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', flex: 1 }}>Column</span>
              <select
                value={videoOverlay.startCol}
                onChange={(e) => updateVideoOverlay({ startCol: parseInt(e.target.value) })}
                style={{
                  height: '2rem',
                  padding: '0 0.5rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '3.5rem',
                  boxSizing: 'border-box'
                }}
              >
                {[...Array(maxStartCol)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Size Controls */}
          <div className="video-overlay-section">
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</div>
            
            {/* Width */}
            <div className="video-control-row">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0', width: '1.5rem', height: '1.5rem', fontSize: '0.75rem' }}>↔</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: '3rem' }}>Width</span>
              <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
                {[...Array(maxWidth)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => updateVideoOverlay({ width: i + 1 })}
                    style={{
                      flex: 1,
                      height: '1.5rem',
                      padding: 0,
                      borderRadius: 0,
                      border: 'none',
                      background: videoOverlay.width === i + 1 
                        ? '#442544' 
                        : '#2a2a2a',
                      color: videoOverlay.width === i + 1 ? '#fe68ff' : '#888888',
                      fontFamily: 'inherit',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Height */}
            <div className="video-control-row">
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0', width: '1.5rem', height: '1.5rem', fontSize: '0.75rem' }}>↕</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', minWidth: '3rem' }}>Height</span>
              <div style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
                {[...Array(maxHeight)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => updateVideoOverlay({ height: i + 1 })}
                    style={{
                      flex: 1,
                      height: '1.5rem',
                      padding: 0,
                      borderRadius: 0,
                      border: 'none',
                      background: videoOverlay.height === i + 1 
                        ? '#442544' 
                        : '#2a2a2a',
                      color: videoOverlay.height === i + 1 ? '#fe68ff' : '#888888',
                      fontFamily: 'inherit',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Line */}
      {!isCollapsed && (
        <div style={{ 
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          background: '#2a2a2a',
          borderRadius: 0,
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>ℹ️</span>
          <span>
            Video box: {videoOverlay.width}×{videoOverlay.height} at Row {videoOverlay.startRow}, Column {videoOverlay.startCol} • Occupies {slotsOccupied} slot{slotsOccupied !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}

function CustomSlotsContent({ customSlots, addCustomSlots, removeCustomSlot, clearCustomSlots, customSlotsHeight, handleCustomSlotsDragStart, isCustomSlotsDragging }) {
  const [collapsed, setCollapsed] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const handleAddSlots = () => {
    if (inputText.trim()) {
      addCustomSlots(inputText);
      setInputText('');
    }
  };
  
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: collapsed ? 0 : '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              background: '#2a2a2a',
              color: '#888888',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              transition: 'transform 0.2s ease'
            }}
          >
            <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{collapsed ? '+' : '−'}</span>
          </button>
          <div className="section-title" style={{ marginBottom: 0 }}>Custom Slots ({customSlots.length})</div>
        </div>
        {customSlots.length > 0 && (
          <button
            onClick={clearCustomSlots}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 0,
              border: 'none',
              background: '#3f230e',
              color: '#ff4e00',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}
          >
            <span>✕</span>
            <span>Clear All</span>
          </button>
        )}
      </div>
      
      {!collapsed && (
        <div className="grid-1-3" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem' }}>
          {/* Left: Input Area (1 column) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Add Slots (one per line)
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', opacity: 0.7, lineHeight: 1.5 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Name</span> — uses default colors<br/>
              <span style={{ color: 'var(--text-secondary)' }}>Name, #bg</span> — custom background, auto text<br/>
              <span style={{ color: 'var(--text-secondary)' }}>Name, #bg, #text</span> — custom colors
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Slot One&#10;Slot Two, #e63946&#10;Slot Three, #2a9d8f, #ffffff"
              style={{
                width: '100%',
                minHeight: '6rem',
                padding: '0.75rem',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                background: '#2a2a2a',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                resize: 'vertical',
                outline: 'none'
              }}
            />
            <button
              onClick={handleAddSlots}
              disabled={!inputText.trim()}
              style={{
                height: '2.5rem',
                padding: '0 1rem',
                borderRadius: 0,
                border: 'none',
                background: inputText.trim() 
                  ? '#442544' 
                  : '#2a2a2a',
                color: inputText.trim() ? '#fe68ff' : '#888888',
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxSizing: 'border-box'
              }}
            >
              <span>+</span>
              <span>Add Slots</span>
            </button>
          </div>
          
          {/* Right: Current Slots List (3 columns) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Current Slots
            </div>
            <div style={{ 
              background: 'var(--bg-panel)', 
              borderRadius: 0, 
              border: '1px solid var(--border-color-inner)',
              borderBottom: 'none',
              padding: '0.5rem',
              height: `${customSlotsHeight}rem`,
              overflowY: 'auto'
            }}>
              {customSlots.length === 0 ? (
                <div style={{ 
                  padding: '1.5rem', 
                  textAlign: 'center', 
                  color: '#888888',
                  fontSize: '0.8125rem'
                }}>
                  No slots added yet
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(6rem, 100%), 1fr))', gap: '0.375rem' }}>
                  {customSlots.map((slot, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.25rem 0.375rem',
                        background: slot.bgColor,
                        borderRadius: 0,
                        fontSize: '0.75rem',
                        border: '1px solid var(--border-color-inner)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', overflow: 'hidden', flex: 1 }}>
                        <span style={{ 
                          minWidth: '1.125rem', 
                          height: '1.125rem', 
                          borderRadius: 0,
                          background: 'rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.5rem',
                          color: '#fff',
                          fontWeight: 600
                        }}>
                          {idx + 1}
                        </span>
                        <span style={{ color: slot.textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{slot.name}</span>
                      </div>
                      <button
                        onClick={() => removeCustomSlot(idx)}
                        style={{
                          minWidth: '1.125rem',
                          height: '1.125rem',
                          borderRadius: 0,
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.625rem',
                          marginLeft: '0.25rem'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Drag handle */}
            <div
              onMouseDown={handleCustomSlotsDragStart}
              onTouchStart={handleCustomSlotsDragStart}
              style={{
                height: '1rem',
                background: isCustomSlotsDragging ? 'var(--drag-handle-active)' : 'var(--drag-handle-bg)',
                borderRadius: 0,
                cursor: 'ns-resize',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color-inner)',
                borderTop: '1px solid var(--drag-handle-border)',
                transition: 'background 0.15s ease',
                marginTop: '-0.0625rem'
              }}
            >
              <div style={{
                width: '3rem',
                height: '0.3125rem',
                borderRadius: 0,
                background: isCustomSlotsDragging ? 'var(--accent)' : 'var(--drag-handle-pill)',
                transition: 'background 0.15s ease'
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BuyerEntryContent({ teams, teamOrder, purchasedTeams, setPurchasedTeams, showClaimOverlay, showStreamOverlay, setStreamOverlay, setStreamOverlayFading, overlayDuration, setOverlayDuration, category, isCustomMode, addLogEntry }) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showOverlayConfirm, setShowOverlayConfirm] = useState(null); // null or 'live', 'pyt', 'stashpass', '2spins'
  const [showRandomizeConfirm, setShowRandomizeConfirm] = useState(false);
  
  const availableTeams = teamOrder.filter(idx => purchasedTeams[idx] === undefined);
  const purchasedCount = Object.keys(purchasedTeams).length;
  
  // Get unique existing buyers
  const existingBuyers = [...new Set(Object.values(purchasedTeams))];
  
  // Filter suggestions based on input
  const filteredSuggestions = buyerName.trim() === '' 
    ? existingBuyers 
    : existingBuyers.filter(buyer => 
        buyer.toLowerCase().includes(buyerName.toLowerCase())
      );
  
  // Group purchases by buyer
  const purchasesByBuyer = {};
  Object.entries(purchasedTeams).forEach(([teamIdx, buyer]) => {
    if (!purchasesByBuyer[buyer]) {
      purchasesByBuyer[buyer] = [];
    }
    purchasesByBuyer[buyer].push(teamIdx);
  });
  
  const handlePurchase = () => {
    if (selectedTeam !== '' && buyerName.trim()) {
      const buyer = buyerName.trim();
      
      // Check if randomize was selected
      if (selectedTeam === 'RANDOMIZE') {
        // Pick random team from available
        const randomIndex = Math.floor(Math.random() * availableTeams.length);
        const teamIdx = availableTeams[randomIndex];
        
        // Show randomizer overlay, then claim overlay
        showStreamOverlay('randomizer');
        
        // After 2 seconds, start fading and transition to claim
        setTimeout(() => {
          // Start fade out of randomizer
          setStreamOverlayFading(true);
          
          // Wait 500ms for quick fade, then show claim
          setTimeout(() => {
            setStreamOverlay(null);
            setStreamOverlayFading(false);
            
            // Now assign team and show claim overlay
            setPurchasedTeams(prev => ({
              ...prev,
              [teamIdx]: buyer
            }));
            addLogEntry(`${buyer} randomized → ${teams[teamIdx].name}`);
            showClaimOverlay(teamIdx, buyer);
          }, 500); // Quick fade out
        }, 2000); // 2 second randomizer duration
        
        // Keep randomizer enabled, just clear buyer name
        setSelectedTeam('RANDOMIZE');
        setBuyerName('');
        setShowSuggestions(false);
      } else {
        // Normal team selection
        const teamIdx = parseInt(selectedTeam);
        setPurchasedTeams(prev => ({
          ...prev,
          [teamIdx]: buyer
        }));
        addLogEntry(`${buyer} purchased ${teams[teamIdx].name}`);
        showClaimOverlay(teamIdx, buyer);
        setSelectedTeam('');
        setBuyerName('');
        setShowSuggestions(false);
      }
    }
  };
  
  const handleUndo = (teamIndex) => {
    const teamName = teams[teamIndex]?.name || 'Team';
    setPurchasedTeams(prev => {
      const newState = { ...prev };
      delete newState[teamIndex];
      return newState;
    });
    addLogEntry(`Undo: ${teamName} returned to available`);
  };
  
  const handleClearAll = () => {
    setPurchasedTeams({});
  };
  
  
  return (
    <div>
      {/* Entry Form */}
      <div className="card" style={{ marginBottom: '1.25rem', overflow: 'visible' }}>
        <div className="section-title">Add Buyer</div>
        <div className="buyer-entry-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
          {/* Column 1: Team Selection */}
          <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◈</span>
              <span className="control-label">Select Team</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                disabled={selectedTeam === 'RANDOMIZE'}
                style={{
                  flex: 1,
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: selectedTeam === 'RANDOMIZE' ? '#1a1a1a' : '#2a2a2a',
                  color: selectedTeam === 'RANDOMIZE' ? '#888' : 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  cursor: selectedTeam === 'RANDOMIZE' ? 'not-allowed' : 'pointer',
                  boxSizing: 'border-box',
                  opacity: selectedTeam === 'RANDOMIZE' ? 0.5 : 1
                }}
              >
                <option value="">Choose a team...</option>
                {availableTeams.map(idx => (
                  <option key={idx} value={idx}>{teams[idx].name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (selectedTeam === 'RANDOMIZE') {
                    // Disable randomize - no confirmation needed
                    setSelectedTeam('');
                  } else {
                    // Enable randomize - show confirmation
                    setShowRandomizeConfirm(true);
                  }
                }}
                style={{
                  minWidth: '6rem',
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: selectedTeam === 'RANDOMIZE' ? '#463a14' : '#2a2a2a',
                  color: selectedTeam === 'RANDOMIZE' ? '#ffd401' : '#888',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                Randomize
              </button>
            </div>
          </div>
          
          {/* Column 2: Buyer Name Input with Autocomplete */}
          <div style={{ position: 'relative' }}>
            <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>◉</span>
                <span className="control-label">Buyer Name</span>
              </div>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => {
                  setBuyerName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyPress={(e) => e.key === 'Enter' && handlePurchase()}
                placeholder="Enter buyer's name..."
                autoComplete="off"
                style={{
                  width: '100%',
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0.625rem',
                right: '0.625rem',
                background: '#1a1a1a',
                border: '1px solid var(--border-color-inner)',
                borderRadius: 0,
                zIndex: 1000,
                boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.5)',
                maxHeight: '12rem',
                overflowY: 'auto',
                marginTop: '0.25rem'
              }}>
                {filteredSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setBuyerName(suggestion);
                      setShowSuggestions(false);
                    }}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: '#fff',
                      borderBottom: idx < filteredSuggestions.length - 1 ? '1px solid var(--border-color-inner)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#213338'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ color: '#7dd3e0' }}>◉</span>
                    <span>{suggestion}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>
                      {purchasesByBuyer[suggestion]?.length || 0} team{(purchasesByBuyer[suggestion]?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Column 3: Submit Button */}
          <div className="control-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem', height: 'auto', padding: '0.625rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="control-icon" style={{ background: '#213338', color: '#7dd3e0' }}>✓</span>
              <span className="control-label">Assign</span>
            </div>
            <button
              onClick={handlePurchase}
              disabled={selectedTeam === '' || !buyerName.trim()}
              style={{
                height: '2.5rem',
                padding: '0 0.75rem',
                borderRadius: 0,
                border: 'none',
                background: selectedTeam !== '' && buyerName.trim() 
                  ? '#314417' 
                  : '#2a2a2a',
                color: selectedTeam !== '' && buyerName.trim() ? '#6cec35' : '#888888',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: selectedTeam !== '' && buyerName.trim() ? 'pointer' : 'not-allowed',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            >
              Confirm Entry
            </button>
          </div>
        </div>
      </div>
      
      {/* Stream Overlays */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Stream Overlays</div>
          <span style={{ 
            fontSize: '0.6875rem', 
            color: '#888', 
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Work in Progress
          </span>
        </div>
        <div className="stream-overlay-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
          {/* Live @ $1 Button */}
          <button
            onClick={() => setShowOverlayConfirm('live')}
            style={{
              padding: '0 1rem',
              height: '2.5rem',
              borderRadius: 0,
              border: 'none',
              background: '#463a14',
              color: '#ffd401',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}
          >
            Live @ $1
          </button>
          
          {/* PYT Button */}
          <button
            onClick={() => setShowOverlayConfirm('pyt')}
            style={{
              padding: '0 1rem',
              height: '2.5rem',
              borderRadius: 0,
              border: 'none',
              background: '#463a14',
              color: '#ffd401',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}
          >
            Pick Your Team
          </button>
          
          {/* Stash or Pass Button */}
          <button
            onClick={() => setShowOverlayConfirm('stashpass')}
            style={{
              padding: '0 1rem',
              height: '2.5rem',
              borderRadius: 0,
              border: 'none',
              background: '#463a14',
              color: '#ffd401',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}
          >
            Stash / Pass
          </button>
          
          {/* Spin 2, Keep 1 Button */}
          <button
            onClick={() => setShowOverlayConfirm('2spins')}
            style={{
              padding: '0 1rem',
              height: '2.5rem',
              borderRadius: 0,
              border: 'none',
              background: '#463a14',
              color: '#ffd401',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}
          >
            Spin 2, Keep 1
          </button>
          
          {/* Duration Control */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            justifyContent: 'center',
            padding: '0 0.75rem',
            borderRadius: 0,
            background: '#2a2a2a',
            border: '1px solid var(--border-color-inner)',
            height: '2.5rem',
            boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '0.8125rem', color: '#888888', fontWeight: 600 }}>Duration</span>
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <button
                onClick={() => setOverlayDuration(Math.max(5, Number((overlayDuration - 0.5).toFixed(1))))}
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: '#1a1a1a',
                  color: '#7dd3e0',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => e.target.style.background = '#213338'}
                onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
              >
                −
              </button>
              <span style={{ 
                fontFamily: 'Space Mono, monospace', 
                fontSize: '0.875rem', 
                fontWeight: 600,
                color: '#fff',
                minWidth: '2.5rem',
                textAlign: 'center'
              }}>
                {overlayDuration}
              </span>
              <button
                onClick={() => setOverlayDuration(Math.min(15, Number((overlayDuration + 0.5).toFixed(1))))}
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: 0,
                  border: 'none',
                  background: '#1a1a1a',
                  color: '#7dd3e0',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                  boxShadow: 'none'
                }}
                onMouseEnter={(e) => e.target.style.background = '#213338'}
                onMouseLeave={(e) => e.target.style.background = '#1a1a1a'}
              >
                +
              </button>
            </div>
            <span style={{ fontSize: '0.8125rem', color: '#888888', fontWeight: 600 }}>s</span>
          </div>
        </div>
      </div>
      
      {/* Purchased List - Grouped by Buyer in 4-column grid */}
      <div className="card">
        <div className="section-title">Purchased Teams ({purchasedCount})</div>
        
        {purchasedCount === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: '#888888',
            fontSize: '0.875rem'
          }}>
            No teams purchased yet. Add a buyer above to get started.
          </div>
        ) : (
          <div className="grid-responsive-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }}>
            {Object.entries(purchasesByBuyer).map(([buyer, teamIndices]) => (
              <div key={buyer} style={{
                background: '#2a2a2a',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                overflow: 'hidden'
              }}>
                {/* Buyer Header */}
                <div style={{
                  padding: '0.5rem 0.75rem',
                  background: '#2a2a2a',
                  borderBottom: '1px solid var(--border-color-inner)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>◉</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {buyer}
                  </span>
                  <span style={{ 
                    fontSize: '0.625rem', 
                    color: '#888888',
                    background: '#2a2a2a',
                    padding: '0.125rem 0.375rem',
                    borderRadius: 0
                  }}>
                    {teamIndices.length}
                  </span>
                </div>
                
                {/* Teams List - 3 column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(5rem, 100%), 1fr))', gap: '0.25rem', padding: '0.375rem' }}>
                  {teamIndices.map((teamIdx) => {
                    const team = teams[teamIdx];
                    return (
                      <div 
                        key={teamIdx}
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'row',
                          alignItems: 'center', 
                          gap: '0.375rem',
                          padding: '0.375rem',
                          background: '#2a2a2a',
                          borderRadius: 0,
                          position: 'relative'
                        }}
                      >
                        {/* Logo (hidden in custom mode) */}
                        {!isCustomMode && (
                          <div style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            borderRadius: 0,
                            background: team.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0
                          }}>
                            <img 
                              src={team.logo} 
                              alt={team.name}
                              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1, fontSize: '0.5625rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {team.name}
                        </div>
                        <button
                          onClick={() => handleUndo(teamIdx)}
                          style={{
                            width: '1.125rem',
                            height: '1.125rem',
                            padding: 0,
                            borderRadius: '50%',
                            border: 'none',
                            background: '#3f230e',
                            color: '#ff4e00',
                            fontFamily: 'inherit',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#3f230e'}
                          onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.15)'}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Stream Overlay Confirmation Dialog */}
      {showOverlayConfirm && (() => {
        const warnings = {
          live: {
            title: 'Live @ $1',
            message: 'Make sure you\'re ready to start selling teams at $1 each. This overlay will display on stream for viewers.'
          },
          pyt: {
            title: 'Pick Your Team',
            message: 'Check the available teams before proceeding. If a high-value chase team is still on the board, you may want to wait before showing this overlay.'
          },
          stashpass: {
            title: 'Stash / Pass',
            message: 'STASH: Keep the first team rolled and stop.\nPASS: Remove the first team and roll again.\n\nMake sure to handle the outcome correctly after the overlay.'
          },
          '2spins': {
            title: 'Spin 2, Keep 1',
            message: '1. Roll/reveal two teams for the buyer\n2. Buyer chooses which team to keep\n3. Remove the team they don\'t want from the board\n\nMake sure to complete both rolls and remove the rejected team.'
          }
        };
        
        const warning = warnings[showOverlayConfirm];
        
        return (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'claimOverlayIn 0.2s ease-out'
          }}>
            <div style={{
              background: 'var(--bg-panel)',
              borderRadius: 0,
              padding: '2rem',
              maxWidth: '32rem',
              width: '90%',
              border: '1px solid var(--border-color-inner)',
              boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.4)'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#ffd401',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>⚠️</span>
                <span>{warning.title}</span>
              </div>
              
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                whiteSpace: 'pre-line'
              }}>
                {warning.message}
              </p>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowOverlayConfirm(null)}
                  style={{
                    flex: 1,
                    height: '2.5rem',
                    padding: '0 1rem',
                    borderRadius: 0,
                    border: '1px solid var(--border-color-inner)',
                    background: '#2a2a2a',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showStreamOverlay(showOverlayConfirm);
                    setShowOverlayConfirm(null);
                  }}
                  style={{
                    flex: 1,
                    height: '2.5rem',
                    padding: '0 1rem',
                    borderRadius: 0,
                    border: 'none',
                    background: '#463a14',
                    color: '#ffd401',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  Show Overlay
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* Randomize Confirmation Dialog */}
      {showRandomizeConfirm && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'claimOverlayIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--bg-panel)',
            borderRadius: 0,
            padding: '2rem',
            maxWidth: '36rem',
            width: '90%',
            border: '1px solid var(--border-color-inner)',
            boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#ffd401',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>🎲</span>
              <span>Enable Randomizer?</span>
            </div>
            
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              The Randomizer will display a slot machine animation and randomly select a team with 100% fair odds when you click "Confirm Entry".
              <br/><br/>
              <strong>You have options:</strong>
              <br/>• Use this built-in randomizer for animated team selection
              <br/>• Use your streaming platform's randomizer instead
              <br/>• Manually select teams from the dropdown (no randomization)
              <br/><br/>
              All methods are equally valid - choose what works best for your break style!
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowRandomizeConfirm(false)}
                style={{
                  flex: 1,
                  height: '2.5rem',
                  padding: '0 1rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedTeam('RANDOMIZE');
                  setShowRandomizeConfirm(false);
                }}
                style={{
                  flex: 1,
                  height: '2.5rem',
                  padding: '0 1rem',
                  borderRadius: 0,
                  border: 'none',
                  background: '#463a14',
                  color: '#ffd401',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                Enable Randomizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TradeMachineContent({ teams, purchasedTeams, setPurchasedTeams, addLogEntry }) {
  const [leftBuyer, setLeftBuyer] = useState('');
  const [leftTeams, setLeftTeams] = useState([]);
  const [rightBuyer, setRightBuyer] = useState('');
  const [rightTeams, setRightTeams] = useState([]);
  const [tradeType, setTradeType] = useState('trade'); // 'trade' or 'respin'
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Get unique buyers
  const buyers = [...new Set(Object.values(purchasedTeams))];
  
  // Get teams by buyer
  const getTeamsByBuyer = (buyer) => {
    return Object.entries(purchasedTeams)
      .filter(([_, b]) => b === buyer)
      .map(([teamIdx, _]) => parseInt(teamIdx));
  };
  
  const leftBuyerTeams = leftBuyer ? getTeamsByBuyer(leftBuyer) : [];
  const rightBuyerTeams = rightBuyer ? getTeamsByBuyer(rightBuyer) : [];
  
  // Toggle team selection
  const toggleLeftTeam = (teamIdx) => {
    setLeftTeams(prev => 
      prev.includes(teamIdx) 
        ? prev.filter(t => t !== teamIdx)
        : [...prev, teamIdx]
    );
  };
  
  const toggleRightTeam = (teamIdx) => {
    setRightTeams(prev => 
      prev.includes(teamIdx) 
        ? prev.filter(t => t !== teamIdx)
        : [...prev, teamIdx]
    );
  };
  
  // Reset selections when buyer changes
  const handleLeftBuyerChange = (buyer) => {
    setLeftBuyer(buyer);
    setLeftTeams([]);
  };
  
  const handleRightBuyerChange = (buyer) => {
    setRightBuyer(buyer);
    setRightTeams([]);
  };
  
  // Execute trade
  const executeTrade = () => {
    if (tradeType === 'respin') {
      // Clear the selected teams (make them available for respin)
      const teamNames = leftTeams.map(idx => teams[idx]?.name || 'Team').join(', ');
      setPurchasedTeams(prev => {
        const newState = { ...prev };
        leftTeams.forEach(teamIdx => {
          delete newState[teamIdx];
        });
        return newState;
      });
      addLogEntry(`Respin: ${leftBuyer} returned ${leftTeams.length} team(s) (${teamNames})`);
      setLeftBuyer('');
      setLeftTeams([]);
    } else {
      // Swap ownership of teams
      const leftTeamNames = leftTeams.map(idx => teams[idx]?.name || 'Team').join(', ');
      const rightTeamNames = rightTeams.map(idx => teams[idx]?.name || 'Team').join(', ');
      setPurchasedTeams(prev => {
        const newState = { ...prev };
        leftTeams.forEach(teamIdx => {
          newState[teamIdx] = rightBuyer;
        });
        rightTeams.forEach(teamIdx => {
          newState[teamIdx] = leftBuyer;
        });
        return newState;
      });
      addLogEntry(`Trade: ${leftBuyer} ↔ ${rightBuyer} (${leftTeamNames} ↔ ${rightTeamNames})`);
      setLeftBuyer('');
      setRightBuyer('');
      setLeftTeams([]);
      setRightTeams([]);
    }
  };
  
  const canExecute = tradeType === 'respin' 
    ? leftBuyer && leftTeams.length >= 2
    : leftBuyer && rightBuyer && leftTeams.length > 0 && rightTeams.length > 0 && leftBuyer !== rightBuyer;
  
  const TeamSelector = ({ teamIndices, selectedTeams, onToggle, emptyMessage }) => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(6rem, 100%), 1fr))', 
      gap: '0.375rem',
      minHeight: '3rem'
    }}>
      {teamIndices.length === 0 ? (
        <div style={{ 
          gridColumn: '1 / -1', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#888888',
          fontSize: '0.75rem',
          padding: '0.75rem'
        }}>
          {emptyMessage}
        </div>
      ) : (
        teamIndices.map(teamIdx => {
          const team = teams[teamIdx];
          const isSelected = selectedTeams.includes(teamIdx);
          return (
            <div
              key={teamIdx}
              onClick={() => onToggle(teamIdx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem',
                background: isSelected ? '#442544' : '#2a2a2a',
                border: `0.125rem solid ${isSelected ? '#fe68ff' : 'var(--border-color)'}`,
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: 0,
                background: team.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img 
                  src={team.logo} 
                  alt={team.name}
                  style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
              <div style={{ 
                flex: 1, 
                fontSize: '0.5625rem', 
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {team.name}
              </div>
              {isSelected && (
                <div style={{ color: '#fe68ff', fontSize: '0.75rem' }}>✓</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
  
  return (
    <div>
      {/* Main Trade Interface - 4 column grid */}
      <div className="grid-1-3" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Column 1: Trade Type */}
        <div className="card">
          <div className="section-title">Trade Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => {
                setTradeType('trade');
                setRightBuyer('');
                setRightTeams([]);
              }}
              style={{
                height: '2.5rem',
                padding: '0 0.75rem',
                borderRadius: 0,
                border: 'none',
                background: tradeType === 'trade' 
                  ? '#442544' 
                  : '#2a2a2a',
                color: tradeType === 'trade' ? '#fe68ff' : '#888888',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            >
              ⇄ Team Trade
            </button>
            <button
              onClick={() => {
                setTradeType('respin');
                setRightBuyer('');
                setRightTeams([]);
              }}
              style={{
                height: '2.5rem',
                padding: '0 0.75rem',
                borderRadius: 0,
                border: 'none',
                background: tradeType === 'respin' 
                  ? '#463a14' 
                  : '#2a2a2a',
                color: tradeType === 'respin' ? '#ffd401' : '#888888',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            >
              ⇄ Respin
            </button>
          </div>
        </div>
        
        {/* Columns 2-4: Trading Panels */}
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: tradeType === 'trade' ? '1fr auto 1fr' : '1fr', gap: '1rem' }}>
            {/* Left Side - Trading Away */}
            <div>
              <div className="section-title" style={{ color: '#ff4e00', marginBottom: '0.75rem' }}>
                {tradeType === 'respin' ? '⇄ Teams for Respin' : '↑ Trading Away'}
              </div>
              
              {/* Buyer Selection */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Select Buyer</div>
                <select
                  value={leftBuyer}
                  onChange={(e) => handleLeftBuyerChange(e.target.value)}
                  style={{
                    width: '100%',
                    height: '2.5rem',
                    padding: '0 0.75rem',
                    borderRadius: 0,
                    border: '1px solid var(--border-color-inner)',
                    background: '#2a2a2a',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '0.875rem',
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Choose buyer...</option>
                  {buyers.map(buyer => (
                    <option key={buyer} value={buyer}>{buyer} ({getTeamsByBuyer(buyer).length})</option>
                  ))}
                </select>
              </div>
              
              {/* Team Selection */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Select Teams ({leftTeams.length})
              </div>
              <TeamSelector 
                teamIndices={leftBuyerTeams}
                selectedTeams={leftTeams}
                onToggle={toggleLeftTeam}
                emptyMessage="Select a buyer"
              />
            </div>
            
            {/* Middle Arrow (only for trade) */}
            {tradeType === 'trade' && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: 'var(--text-muted)'
              }}>
                ⇄
              </div>
            )}
            
            {/* Right Side - Receiving (only for trade) */}
            {tradeType === 'trade' && (
              <div>
                <div className="section-title" style={{ color: '#6cec35', marginBottom: '0.75rem' }}>↓ Receiving</div>
                
                {/* Buyer Selection */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Select Buyer</div>
                  <select
                    value={rightBuyer}
                    onChange={(e) => handleRightBuyerChange(e.target.value)}
                    style={{
                      width: '100%',
                      height: '2.5rem',
                      padding: '0 0.75rem',
                      borderRadius: 0,
                      border: '1px solid var(--border-color-inner)',
                      background: '#2a2a2a',
                      color: 'var(--text-primary)',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      outline: 'none',
                      cursor: 'pointer',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Choose buyer...</option>
                    {buyers.filter(b => b !== leftBuyer).map(buyer => (
                      <option key={buyer} value={buyer}>{buyer} ({getTeamsByBuyer(buyer).length})</option>
                    ))}
                  </select>
                </div>
                
                {/* Team Selection */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Select Teams ({rightTeams.length})
                </div>
                <TeamSelector 
                  teamIndices={rightBuyerTeams}
                  selectedTeams={rightTeams}
                  onToggle={toggleRightTeam}
                  emptyMessage="Select a buyer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Trade Summary & Execute */}
      <div className="card">
        <div className="section-title">Trade Summary</div>
        
        {tradeType === 'respin' ? (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(245, 158, 11, 0.1)', 
            borderRadius: 0,
            marginBottom: '1rem'
          }}>
            {leftTeams.length >= 2 ? (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <strong>{leftBuyer}</strong> trades {leftTeams.length} teams for a <strong style={{ color: '#ffd401' }}>RESPIN</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Teams will become available for re-entry via Buyer Entry
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Select a buyer and at least 2 teams to trade for a respin
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            padding: '1rem', 
            background: '#2a2a2a', 
            borderRadius: 0,
            marginBottom: '1rem'
          }}>
            {leftTeams.length > 0 && rightTeams.length > 0 ? (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                <strong>{leftBuyer}</strong> receives {rightTeams.length} team{rightTeams.length !== 1 ? 's' : ''} from <strong>{rightBuyer}</strong>
                <br />
                <strong>{rightBuyer}</strong> receives {leftTeams.length} team{leftTeams.length !== 1 ? 's' : ''} from <strong>{leftBuyer}</strong>
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Select buyers and teams on both sides to complete a trade
              </div>
            )}
          </div>
        )}
        
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!canExecute}
          style={{
            width: '100%',
            height: '2.5rem',
            padding: '0 0.75rem',
            borderRadius: 0,
            border: 'none',
            background: canExecute 
              ? (tradeType === 'respin' 
                  ? '#463a14' 
                  : '#314417')
              : '#2a2a2a',
            color: canExecute 
              ? (tradeType === 'respin' ? '#ffd401' : '#6cec35')
              : '#888888',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: canExecute ? 'pointer' : 'not-allowed',
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
        >
          {tradeType === 'respin' ? '⇄ Execute Respin' : '✓ Execute Trade'}
        </button>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirm && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'claimOverlayIn 0.2s ease-out',
          borderRadius: 0
        }}>
          <div style={{
            background: 'var(--bg-panel)',
            borderRadius: 0,
            padding: '2rem',
            maxWidth: '32rem',
            width: '90%',
            border: '1px solid var(--border-color-inner)',
            boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: tradeType === 'respin' ? '#ffd401' : '#6cec35',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>{tradeType === 'respin' ? '⇄' : '✓'}</span>
              <span>{tradeType === 'respin' ? 'Confirm Respin' : 'Confirm Trade'}</span>
            </div>
            
            <div style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              {tradeType === 'respin' ? (
                <>
                  <p style={{ marginBottom: '0.5rem' }}>Release {leftTeams.length} team{leftTeams.length !== 1 ? 's' : ''} from <strong style={{ color: '#ff4e00' }}>{leftBuyer}</strong> back to available?</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#888' }}>{leftTeams.map(idx => teams[idx].name).join(', ')}</p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#ff4e00' }}>{leftBuyer}</strong> gives {leftTeams.length} team{leftTeams.length !== 1 ? 's' : ''}:</p>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', color: '#888' }}>{leftTeams.map(idx => teams[idx].name).join(', ')}</p>
                  
                  <p style={{ marginBottom: '0.5rem' }}><strong style={{ color: '#6cec35' }}>{rightBuyer}</strong> gives {rightTeams.length} team{rightTeams.length !== 1 ? 's' : ''}:</p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#888' }}>{rightTeams.map(idx => teams[idx].name).join(', ')}</p>
                </>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1,
                  height: '2.5rem',
                  padding: '0 1rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)',
                  background: '#2a2a2a',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  executeTrade();
                  setShowConfirm(false);
                }}
                style={{
                  flex: 1,
                  height: '2.5rem',
                  padding: '0 1rem',
                  borderRadius: 0,
                  border: 'none',
                  background: tradeType === 'respin' ? '#463a14' : '#314417',
                  color: tradeType === 'respin' ? '#ffd401' : '#6cec35',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                {tradeType === 'respin' ? 'Execute Respin' : 'Execute Trade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExportContent({ boxName, boxNumber, purchasedTeams, teams, exportToCSV, generateCSVData, transactionLog, logExpanded, setLogExpanded, setTransactionLog }) {
  // Group teams by buyer for preview
  const purchasesByBuyer = {};
  Object.entries(purchasedTeams).forEach(([teamIdx, buyer]) => {
    if (!purchasesByBuyer[buyer]) purchasesByBuyer[buyer] = [];
    purchasesByBuyer[buyer].push(parseInt(teamIdx));
  });
  
  const buyerCount = Object.keys(purchasesByBuyer).length;
  const teamCount = Object.keys(purchasedTeams).length;
  
  return (
    <div>
      <div className="card">
        <div className="section-title">Export Data</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem', lineHeight: 1.6 }}>
          Export the current box break results to a CSV file. The export includes box name, box number, buyer names, team counts, and final team assignments.
        </p>
        <p style={{ color: '#888', fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.5 }}>
          Note: This export is completely optional. If you're comfortable using your streaming platform's CSV export (Whatnot, eBay, etc), continue using that. This is just an alternative option for organizing shipments.
        </p>
        
        <div className="export-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
          {/* Column 1: Stats + Export Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ 
              background: 'var(--bg-panel)', 
              padding: '1rem', 
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fe68ff' }}>{boxNumber}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Box Number</div>
            </div>
            <div style={{ 
              background: 'var(--bg-panel)', 
              padding: '1rem', 
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6cec35' }}>{buyerCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Buyers</div>
            </div>
            <div style={{ 
              background: 'var(--bg-panel)', 
              padding: '1rem', 
              borderRadius: 0,
              border: '1px solid var(--border-color-inner)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffd401' }}>{teamCount}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Teams Sold</div>
            </div>
            
            {/* Export Button */}
            <button
              data-export-csv
              onClick={exportToCSV}
              disabled={teamCount === 0}
              style={{
                width: '100%',
                height: '2.5rem',
                padding: '0 1rem',
                borderRadius: 0,
                border: 'none',
                background: teamCount > 0 
                  ? '#314417' 
                  : '#2a2a2a',
                color: teamCount > 0 ? '#6cec35' : '#888888',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: teamCount > 0 ? 'pointer' : 'not-allowed',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: 'auto',
                boxSizing: 'border-box'
              }}
            >
              <span>↓</span>
              <span>Export CSV</span>
            </button>
          </div>
          
          {/* Columns 2-4: Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gridColumn: 'span 3' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</div>
            
            {buyerCount === 0 ? (
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: '#888888',
                fontSize: '0.875rem',
                background: 'var(--bg-panel)',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                No data to export. Add buyers in the Buyer Entry tab to see a preview.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ 
                  background: 'var(--bg-panel)', 
                  borderRadius: 0, 
                  border: '1px solid var(--border-color-inner)',
                  overflow: 'hidden',
                  flex: 1
                }}>
                  {/* Header Row */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr 3fr',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: '#2a2a2a',
                    borderBottom: '1px solid var(--border-color-inner)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    color: '#888888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    <div>Buyer Name</div>
                    <div>Teams</div>
                    <div>Team Names</div>
                  </div>
                  
                  {/* Data Rows */}
                  {Object.entries(purchasesByBuyer).map(([buyer, teamIndices], idx) => (
                    <div 
                      key={buyer}
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr 3fr',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderBottom: idx < Object.keys(purchasesByBuyer).length - 1 ? '1px solid var(--border-color-inner)' : 'none',
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{buyer}</div>
                      <div style={{ color: '#6cec35', fontWeight: 600 }}>{teamIndices.length}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        {teamIndices.map(idx => teams[idx].name).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* File Info */}
                {(() => {
                  const now = new Date();
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const dateStr = `${months[now.getMonth()]}-${String(now.getDate()).padStart(2, '0')}-${now.getFullYear()}`;
                  const safeBoxName = boxName.replace(/\s+/g, '_');
                  
                  return (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem 1rem', 
                      background: '#2a2a2a', 
                      borderRadius: 0,
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Filename:</strong> Export_{safeBoxName}_{boxNumber}_{dateStr}.csv
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Transaction Log */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div className="section-title">Transaction Log</div>
          {transactionLog.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                
                // Generate log text
                const logText = `StreamSlot Transaction Log\nBox: ${boxName} #${boxNumber}\nGenerated: ${new Date().toLocaleString()}\n\n${'='.repeat(60)}\n\n` +
                  transactionLog.map(entry => {
                    const time = new Date(entry.timestamp);
                    const timeStr = time.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true 
                    });
                    return `${timeStr} - ${entry.message}`;
                  }).join('\n');
                
                // Create and download file
                const blob = new Blob([logText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                
                const safeBoxName = boxName.replace(/[^a-z0-9]/gi, '_');
                const dateStr = new Date().toISOString().split('T')[0];
                link.download = `TransactionLog_${safeBoxName}_${boxNumber}_${dateStr}.txt`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 400,
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'none',
                transition: 'opacity 0.2s ease',
                opacity: 1,
                marginTop: '0.125rem'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.7'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Export Log
            </button>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Chronological record of all purchases, trades, and respins for this box break.
        </p>
        
        <div style={{
          background: 'var(--bg-panel)',
          borderRadius: 0,
          border: '1px solid var(--border-color-inner)',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setLogExpanded(!logExpanded)}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'left'
            }}
          >
            <span style={{ 
              width: '2rem', 
              height: '2rem',
              background: '#2a2a2a',
              borderRadius: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0
            }}>
              📋
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                View Transaction Log
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {transactionLog.length === 0 ? 'No transactions yet' : `${transactionLog.length} transaction${transactionLog.length === 1 ? '' : 's'} recorded`}
              </div>
            </div>
            
            <button
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                marginLeft: 'auto',
                flexShrink: 0
              }}
            >
              <span style={{ 
                color: '#fff', 
                fontSize: '1rem',
                fontWeight: 700
              }}>
                {logExpanded ? '−' : '+'}
              </span>
            </button>
          </button>
          
          {logExpanded && (
            <div style={{ 
              padding: '0 1rem 1rem 1rem',
              borderTop: '1px solid var(--border-color-inner)'
            }}>
              {/* Log Display */}
              <div style={{
                background: '#1a1a1a',
                border: '1px solid var(--border-color-inner)',
                borderRadius: 0,
                padding: '1rem',
                maxHeight: '300px',
                overflowY: 'auto',
                fontSize: '0.8125rem',
                fontFamily: "'Courier New', monospace",
                marginTop: '1rem',
                marginBottom: '1rem'
              }}>
                {transactionLog.length === 0 ? (
                  <div style={{ color: '#888888', textAlign: 'center', padding: '2rem' }}>
                    No transactions yet. Purchases, trades, and respins will appear here.
                  </div>
                ) : (
                  transactionLog.map((entry, index) => {
                    const time = new Date(entry.timestamp);
                    const timeStr = time.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    });
                    return (
                      <div 
                        key={index}
                        style={{
                          color: 'var(--text-secondary)',
                          marginBottom: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderBottom: index < transactionLog.length - 1 ? '1px solid #2a2a2a' : 'none'
                        }}
                      >
                        <span style={{ color: '#888888' }}>{timeStr}</span>
                        <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>•</span>
                        <span>{entry.message}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HelpContent() {
  const [expandedSection, setExpandedSection] = useState(null);
  const [toolGuideCollapsed, setToolGuideCollapsed] = useState(true);
  const [faqCollapsed, setFaqCollapsed] = useState(true);
  const [tipsCollapsed, setTipsCollapsed] = useState(true);
  
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  const toolGuides = [
    {
      id: 'layout',
      icon: '◈',
      title: 'Layout Tab',
      description: 'Configure your board appearance and scene settings.',
      details: [
        { label: 'Sport Selection', text: 'Choose between NBA (30 teams), MLB (30 teams), NFL (32 teams), or Custom mode for your own slots.' },
        { label: 'Columns & Spacing', text: 'Use stepper buttons to adjust columns (2-16) and spacing (0-2) for your preferred layout.' },
        { label: 'Video Overlay', text: 'Reserve space on your board for a video feed (webcam, product shots, etc). Configure position (row/column) and size (width/height). Appears as a camera emoji placeholder on the board.' },
        { label: 'Scene Text', text: 'Customize box name, box number, scene note, and slot counter that appear on your stream.' },
        { label: 'Dark Text Toggle', text: 'Switch between light (default) and dark text for better visibility on different backgrounds.' },
        { label: 'Scene Height', text: 'Drag the handle at the bottom of the scene to resize it vertically (18-64rem).' },
        { label: 'Shuffle', text: 'Randomize team positions on the board - located in the Layout section header.' },
        { label: 'Chroma Key', text: 'Enable pure green (#00FF00) background for OBS transparency - toggle in Layout section header.' },
        { label: 'Custom Slots', text: 'Create your own slots with custom names and colors. Format: Name, #bgColor, #textColor (colors optional).' },
      ]
    },
    {
      id: 'buyer',
      icon: '◉',
      title: 'Buyer Entry Tab',
      description: 'Assign teams to buyers and manage purchases.',
      details: [
        { label: 'Team Selection', text: 'Choose from available (unpurchased) teams in the dropdown menu.' },
        { label: 'Randomize Button', text: 'Click the "Randomize" button to enable random team selection. When active, the dropdown is disabled and a random team will be selected on confirmation.' },
        { label: 'Randomizer Overlay', text: 'Shows a 2-second slot machine animation with 5 spinning reels of team colors and a loading bar. After completion, displays the randomly selected team with claim overlay.' },
        { label: 'Buyer Name', text: 'Enter buyer\'s name with autocomplete suggestions from previous entries.' },
        { label: 'Confirm Entry', text: 'Assign the selected team to the buyer. Triggers claim animation overlay on screen.' },
        { label: 'Purchased Teams List', text: 'View all assignments grouped by buyer with team counts and undo buttons.' },
        { label: 'Stream Overlays', text: 'Yellow buttons trigger full-screen overlays: Live @ $1, Pick Your Team, Stash or Pass, and Spin 2, Keep 1.' },
        { label: 'Duration Control', text: 'Set how long stream overlays display (5-15 seconds) using stepper buttons. Note: Randomizer always runs for 2 seconds.' },
      ]
    },
    {
      id: 'trade',
      icon: '⇄',
      title: 'Trade Machine Tab',
      description: 'Execute trades between buyers or process respins.',
      details: [
        { label: 'Trade Type', text: 'Toggle between Team Trade (swap teams between buyers) or Respin (return teams to available pool).' },
        { label: 'Team Trade', text: 'Select teams from each buyer to swap. Both sides must have teams selected. Confirm before executing.' },
        { label: 'Respin', text: 'Select 2+ teams from a buyer to return to the available pool. Requires confirmation.' },
        { label: 'Team Selection', text: 'Click teams to select/deselect. Selected teams show a pink border and checkmark.' },
        { label: 'Execute', text: 'Confirmation dialog appears before completing any trade or respin to prevent mistakes.' },
      ]
    },
    {
      id: 'export',
      icon: '↓',
      title: 'Export Tab',
      description: 'Optional export for shipping and inventory organization.',
      details: [
        { label: 'Optional Feature', text: 'Export CSV is completely optional. If you\'re comfortable using your streaming platform\'s CSV export (Whatnot, eBay, etc), continue using that. StreamSlot\'s export is just an alternative option for organizing shipments.' },
        { label: 'Stats Display', text: 'View current box number, total unique buyers, and teams sold count.' },
        { label: 'Preview', text: 'See all buyer assignments with team counts before exporting.' },
        { label: 'Export CSV', text: 'Green button downloads a CSV file with box info, buyers, and all team assignments for shipping reference.' },
        { label: 'Filename Format', text: 'Auto-generated as Export_BoxName_BoxNumber_Date.csv for easy organization.' },
      ]
    },
    {
      id: 'reset',
      icon: '↺',
      title: 'Reset Board',
      description: 'Clear all purchases and start a new box.',
      details: [
        { label: 'Reset Board', text: 'Orange button in header clears all purchased teams and increments box number by 1.' },
        { label: 'Confirmation Required', text: 'Warning dialog appears to prevent accidental resets.' },
        { label: 'Export & Reset', text: 'Green button downloads CSV of current data before resetting.' },
        { label: 'Box Number', text: 'Automatically increments (001 → 002 → 003) while preserving leading zeros.' },
        { label: 'Preserved Settings', text: 'Layout preferences, custom slots, and scene settings remain unchanged.' },
      ]
    },
    {
      id: 'persistence',
      icon: '◼',
      title: 'Auto-Save',
      description: 'Your settings and data persist automatically.',
      details: [
        { label: 'What\'s Saved', text: 'All settings including layout, purchases, custom slots, box info, and preferences.' },
        { label: 'When', text: 'Saves automatically on every change - no save button needed.' },
        { label: 'Storage', text: 'Data stored locally in your browser, persists across refreshes and restarts.' },
        { label: 'Privacy', text: 'All data stays on your device. Nothing is sent to servers or cloud.' },
        { label: 'Category Warning', text: 'Switching categories clears purchases - confirmation dialog prevents accidents.' },
      ]
    },
    {
      id: 'keyboard',
      icon: '⌨',
      title: 'Keyboard Shortcuts',
      description: 'Speed up your workflow with hotkeys.',
      details: [
        { label: 'Export CSV', text: 'Press Ctrl+S (or Cmd+S on Mac) to quickly export when on the Export tab with purchased teams.' },
        { label: 'Shuffle Teams', text: 'Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to shuffle with confirmation dialog.' },
        { label: 'Close Overlays', text: 'Press Escape to close stream overlays, reset confirmation, or category change dialogs.' },
        { label: 'Switch Tabs', text: 'Press 1-5 to quickly jump between tabs: 1=Layout, 2=Entry, 3=Trade, 4=Export, 5=Help.' },
        { label: 'Smart Detection', text: 'Shortcuts don\'t trigger while typing in input fields - type freely without conflicts.' },
      ]
    },
  ];
  
  const faqs = [
    {
      q: 'How do I use this with OBS?',
      a: 'Add a Browser Source in OBS pointing to StreamSlot, or use Window Capture to show the scene area. Enable the green Chroma button in Layout to use #00FF00 background for transparent keying in OBS.'
    },
    {
      q: 'Can I use custom team names instead of NBA/MLB/NFL?',
      a: 'Yes! Click the Custom (✏️) button in the Layout tab. Add your own slot names with optional custom colors using format: Name, #bgColor, #textColor'
    },
    {
      q: 'How do I adjust columns and spacing?',
      a: 'In the Layout tab, use the stepper buttons (- and +) to adjust Columns (2-16) and Spacing (0-2). These replaced the old sliders for better mobile experience.'
    },
    {
      q: 'What are Stream Overlays and how do I use them?',
      a: 'Yellow buttons in the Buyer Entry tab trigger full-screen animations: Live @ $1, Pick Your Team, Stash or Pass, and Spin 2, Keep 1. Set duration (5-15 seconds) with stepper buttons. Perfect for viewer engagement during breaks.'
    },
    {
      q: 'What happens when I change categories (NBA/MLB/NFL)?',
      a: 'If you have purchased teams, a warning dialog appears. Changing categories clears all purchases and resets the board. Click Cancel if it was a mistake.'
    },
    {
      q: 'What keyboard shortcuts are available?',
      a: 'Ctrl+S (Cmd+S on Mac) exports CSV, Ctrl+Shift+R shuffles teams, Escape closes dialogs/overlays, and 1-5 switches tabs. Shortcuts won\'t trigger while typing in input fields. See the Keyboard Shortcuts section in Tool Guide for complete details.'
    },
    {
      q: 'How does the Randomizer work?',
      a: 'Click the "Randomize" button next to team selection, enter a buyer name, and click "Confirm Entry". A 2-second slot machine overlay shows 5 spinning reels of team colors with a loading bar. The system randomly selects from all available teams with 100% fair odds - no manipulation possible. After the animation, the selected team is revealed and assigned to the buyer.'
    },
    {
      q: 'What is the Video Overlay feature?',
      a: 'The Video Overlay in the Layout tab lets you reserve space on your board for video content (webcam, product close-ups, etc). Configure its position and size to fit your layout. The reserved space shows a camera emoji placeholder and won\'t display team slots.'
    },
    {
      q: 'Why do confirmation dialogs appear when I click overlay buttons?',
      a: 'Confirmation dialogs for Stream Overlays (Live @ $1, Pick Your Team, etc) and the Randomizer help prevent accidental triggers during live breaks. They provide helpful reminders about what each feature does before displaying it on stream. You can always click Cancel if it was unintentional.'
    },
    {
      q: 'How do trades and respins work?',
      a: 'In the Trade Machine tab: Team Trade swaps teams between two buyers (both must select teams). Respin returns 2+ selected teams back to available pool. Both require confirmation to prevent mistakes.'
    },
    {
      q: 'Is my data saved if I close the browser?',
      a: 'Yes! StreamSlot auto-saves everything to your browser\'s local storage. All settings, purchases, and custom slots are preserved when you return - even after closing the browser.'
    },
    {
      q: 'Can I undo a purchase by mistake?',
      a: 'Yes! In the Buyer Entry tab under Purchased Teams, each buyer has an orange undo (X) button next to their teams. Click it to return that team to the available pool.'
    },
    {
      q: 'What is the Export CSV used for?',
      a: 'Export CSV is a completely optional feature - you don\'t need to use it at all. If you\'re comfortable using your streaming platform\'s CSV export (Whatnot, eBay, etc) for organizing shipments, stick with that. StreamSlot\'s export is just an alternative option that organizes team assignments to help with shipping logistics. Use whichever method works best for your workflow.'
    },
    {
      q: 'How do I make the text readable on different backgrounds?',
      a: 'Use the Dark Text toggle in the Layout tab. OFF gives you light/white text (default), ON gives you dark text. This helps visibility whether you use normal or chroma key backgrounds.'
    },
  ];
  
  return (
    <div>
      {/* Contact Banner */}
      <div className="card" style={{ 
        background: '#2a2a2a',
        borderColor: '#3a3a3a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>💡</span>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
            Have ideas, suggestions, or found a bug? We'd love to hear from you! Reach out at <strong style={{ color: 'var(--accent)' }}>[email placeholder]</strong>
          </p>
        </div>
      </div>
      
      {/* Tool Guides */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: toolGuideCollapsed ? 0 : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setToolGuideCollapsed(!toolGuideCollapsed)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                background: '#2a2a2a',
                color: '#888888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                transition: 'transform 0.2s ease'
              }}
            >
              <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{toolGuideCollapsed ? '+' : '−'}</span>
            </button>
            <div className="section-title" style={{ marginBottom: 0 }}>Tool Guide</div>
          </div>
        </div>
        
        {!toolGuideCollapsed && (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Learn how to use each feature of StreamSlot to run smooth box breaks.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {toolGuides.map((tool) => (
            <div 
              key={tool.id}
              style={{
                background: 'var(--bg-panel)',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleSection(tool.id)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  textAlign: 'left'
                }}
              >
                <span style={{ 
                  width: '2rem', 
                  height: '2rem', 
                  borderRadius: 0,
                  background: '#442544',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  color: '#fe68ff'
                }}>
                  {tool.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{tool.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{tool.description}</div>
                </div>
                <span style={{ 
                  color: '#fff', 
                  fontSize: '1rem',
                  fontWeight: 700
                }}>
                  {expandedSection === tool.id ? '−' : '+'}
                </span>
              </button>
              
              {expandedSection === tool.id && (
                <div style={{ 
                  padding: '0 1rem 1rem 1rem',
                  borderTop: '1px solid var(--border-color-inner)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    {tool.details.map((detail, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                        <div style={{ 
                          minWidth: '0.375rem', 
                          height: '0.375rem', 
                          borderRadius: '50%', 
                          background: 'var(--accent)',
                          marginTop: '0.5rem'
                        }} />
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{detail.label}: </span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>{detail.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
          </>
        )}
      </div>
      
      {/* FAQ */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: faqCollapsed ? 0 : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setFaqCollapsed(!faqCollapsed)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                background: '#2a2a2a',
                color: '#888888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                transition: 'transform 0.2s ease'
              }}
            >
              <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{faqCollapsed ? '+' : '−'}</span>
            </button>
            <div className="section-title" style={{ marginBottom: 0 }}>Frequently Asked Questions</div>
          </div>
        </div>
        
        {!faqCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-panel)',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)'
              }}
            >
              <div style={{ 
                fontWeight: 600, 
                color: 'var(--text-primary)', 
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem'
              }}>
                <span style={{ color: 'var(--accent)' }}>Q:</span>
                {faq.q}
              </div>
              <div style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                paddingLeft: '1.25rem'
              }}>
                {faq.a}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      
      {/* Quick Tips */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tipsCollapsed ? 0 : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setTipsCollapsed(!tipsCollapsed)}
              style={{
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: 0,
                border: '1px solid var(--border-color-inner)',
                background: '#2a2a2a',
                color: '#888888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                transition: 'transform 0.2s ease'
              }}
            >
              <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{tipsCollapsed ? '+' : '−'}</span>
            </button>
            <div className="section-title" style={{ marginBottom: 0 }}>Quick Tips</div>
          </div>
        </div>
        
        {!tipsCollapsed && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))', gap: '0.75rem' }}>
            {[
              { icon: '🎲', title: 'Randomizer Feature', tip: 'Click "Randomize" button next to team selection for exciting slot machine animation. Shows 5 reels of team colors for 2 seconds, then reveals the randomly selected team. 100% fair odds.' },
              { icon: '⌨', title: 'Keyboard Shortcuts', tip: 'Use Ctrl+S to export, Ctrl+Shift+R to shuffle, Escape to close dialogs, and 1-5 to switch tabs. See Help tab for full list.' },
              { icon: '◈', title: 'OBS Chroma Key', tip: 'Enable the green Chroma button in Layout for a pure #00FF00 background. Perfect for transparent overlays in OBS using chroma key.' },
              { icon: '⚙', title: 'Stepper Buttons', tip: 'All numeric controls use + and - buttons instead of sliders. Better for precise adjustments and works great on mobile devices.' },
              { icon: '⇄', title: 'Shuffle Before Live', tip: 'Hit the Shuffle button (in Layout section header) before going live to randomize team positions. Adds fairness and excitement to breaks.' },
              { icon: '◼', title: 'Auto-Save Active', tip: 'Everything saves automatically in your browser. Close anytime - your data will be there when you return. No cloud, 100% private.' },
              { icon: '▢', title: 'Second Screen Setup', tip: 'Run StreamSlot on a secondary monitor or tablet while streaming on your main display. Keeps your workflow smooth.' },
              { icon: '◉', title: 'Name Autocomplete', tip: 'Start typing a buyer name to see suggestions from previous entries. Speeds up data entry during fast-paced breaks.' },
              { icon: '⚠️', title: 'Confirmation Dialogs', tip: 'Reset Board, Category changes, Stream Overlays, Randomizer, and Trade/Respin all show confirmation warnings. Prevents accidental triggers and data loss during live breaks.' },
              { icon: '↓', title: 'Export CSV (Optional)', tip: 'Export is completely optional. Use it if you want an extra reference for shipping organization, or stick with your platform\'s tools - either way works!' },
              { icon: '🎨', title: 'Dark Text Toggle', tip: 'Switch between light and dark text in Layout tab for better visibility on different backgrounds or chroma key setups.' },
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '1rem',
                  background: 'var(--bg-panel)',
                  borderRadius: 0,
                  border: '1px solid var(--border-color-inner)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{item.title}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: 0, lineHeight: 1.5 }}>
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

// Expose Dashboard globally for rendering
window.Dashboard = Dashboard;

