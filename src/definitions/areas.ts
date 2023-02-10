/**
 * entsoe-api-client
 * @author Hexagon <hexagon@GitHub>
 * @license MIT
 */

/**
 * Enum for ENTSO-e Areas with description
 *
 * Descriptor description:
 *
 *    BZN — Bidding Zone
 *    BZA — Bidding Zone Aggregation
 *    CA — Control Area
 *    MBA — Market Balance Area
 *    IBA — Imbalance Area
 *    IPA — Imbalance Price Area
 *    LFA — Load Frequency Control Area
 *    LFB — Load Frequency Control Block
 *    REG — Region
 *    SCA — Scheduling Area
 *    SNA — Synchronous Area
 *
 * @readonly
 * @enum {string}
 */
const Areas = {
  /** CTA|NIE, MBA|SEM(SONI), SCA|NIE */
  "10Y1001A1001A016": "CTA|NIE, MBA|SEM(SONI), SCA|NIE",
  /** SCA|EE, MBA|EE, CTA|EE, BZN|EE, Estonia (EE) */
  "10Y1001A1001A39I": "SCA|EE, MBA|EE, CTA|EE, BZN|EE, Estonia (EE)",
  /** IPA|SE1, BZN|SE1, MBA|SE1, SCA|SE1 */
  "10Y1001A1001A44P": "IPA|SE1, BZN|SE1, MBA|SE1, SCA|SE1",
  /** SCA|SE2, MBA|SE2, BZN|SE2, IPA|SE2 */
  "10Y1001A1001A45N": "SCA|SE2, MBA|SE2, BZN|SE2, IPA|SE2",
  /** IPA|SE3, BZN|SE3, MBA|SE3, SCA|SE3 */
  "10Y1001A1001A46L": "IPA|SE3, BZN|SE3, MBA|SE3, SCA|SE3",
  /** SCA|SE4, MBA|SE4, BZN|SE4, IPA|SE4 */
  "10Y1001A1001A47J": "SCA|SE4, MBA|SE4, BZN|SE4, IPA|SE4",
  /** IPA|NO5, IBA|NO5, BZN|NO5, MBA|NO5, SCA|NO5 */
  "10Y1001A1001A48H": "IPA|NO5, IBA|NO5, BZN|NO5, MBA|NO5, SCA|NO5",
  /** SCA|RU, MBA|RU, BZN|RU, CTA|RU */
  "10Y1001A1001A49F": "SCA|RU, MBA|RU, BZN|RU, CTA|RU",
  /** CTA|RU-KGD, BZN|RU-KGD, MBA|RU-KGD, SCA|RU-KGD */
  "10Y1001A1001A50U": "CTA|RU-KGD, BZN|RU-KGD, MBA|RU-KGD, SCA|RU-KGD",
  /** SCA|BY, MBA|BY, BZN|BY, CTA|BY */
  "10Y1001A1001A51S": "SCA|BY, MBA|BY, BZN|BY, CTA|BY",
  /** BZN|IE(SEM), MBA|IE(SEM), SCA|IE(SEM), LFB|IE-NIE, SNA|Ireland */
  "10Y1001A1001A59C": "BZN|IE(SEM), MBA|IE(SEM), SCA|IE(SEM), LFB|IE-NIE, SNA|Ireland",
  /** BZN|DE-AT-LU */
  "10Y1001A1001A63L": "BZN|DE-AT-LU",
  /** BZN|NO1A */
  "10Y1001A1001A64J": "BZN|NO1A",
  /** Denmark (DK) */
  "10Y1001A1001A65H": "Denmark (DK)",
  /** BZN|IT-GR */
  "10Y1001A1001A66F": "BZN|IT-GR",
  /** BZN|IT-North-SI */
  "10Y1001A1001A67D": "BZN|IT-North-SI",
  /** BZN|IT-North-CH */
  "10Y1001A1001A68B": "BZN|IT-North-CH",
  /** BZN|IT-Brindisi, SCA|IT-Brindisi, MBA|IT-Z-Brindisi */
  "10Y1001A1001A699": "BZN|IT-Brindisi, SCA|IT-Brindisi, MBA|IT-Z-Brindisi",
  /** MBA|IT-Z-Centre-North, SCA|IT-Centre-North, BZN|IT-Centre-North */
  "10Y1001A1001A70O": "MBA|IT-Z-Centre-North, SCA|IT-Centre-North, BZN|IT-Centre-North",
  /** BZN|IT-Centre-South, SCA|IT-Centre-South, MBA|IT-Z-Centre-South */
  "10Y1001A1001A71M": "BZN|IT-Centre-South, SCA|IT-Centre-South, MBA|IT-Z-Centre-South",
  /** MBA|IT-Z-Foggia, SCA|IT-Foggia, BZN|IT-Foggia */
  "10Y1001A1001A72K": "MBA|IT-Z-Foggia, SCA|IT-Foggia, BZN|IT-Foggia",
  /** BZN|IT-North, SCA|IT-North, MBA|IT-Z-North */
  "10Y1001A1001A73I": "BZN|IT-North, SCA|IT-North, MBA|IT-Z-North",
  /** MBA|IT-Z-Sardinia, SCA|IT-Sardinia, BZN|IT-Sardinia */
  "10Y1001A1001A74G": "MBA|IT-Z-Sardinia, SCA|IT-Sardinia, BZN|IT-Sardinia",
  /** BZN|IT-Sicily, SCA|IT-Sicily, MBA|IT-Z-Sicily */
  "10Y1001A1001A75E": "BZN|IT-Sicily, SCA|IT-Sicily, MBA|IT-Z-Sicily",
  /** MBA|IT-Z-Priolo, SCA|IT-Priolo, BZN|IT-Priolo */
  "10Y1001A1001A76C": "MBA|IT-Z-Priolo, SCA|IT-Priolo, BZN|IT-Priolo",
  /** BZN|IT-Rossano, SCA|IT-Rossano, MBA|IT-Z-Rossano */
  "10Y1001A1001A77A": "BZN|IT-Rossano, SCA|IT-Rossano, MBA|IT-Z-Rossano",
  /** MBA|IT-Z-South, SCA|IT-South, BZN|IT-South */
  "10Y1001A1001A788": "MBA|IT-Z-South, SCA|IT-South, BZN|IT-South",
  /** CTA|DK */
  "10Y1001A1001A796": "CTA|DK",
  /** BZN|IT-North-AT */
  "10Y1001A1001A80L": "BZN|IT-North-AT",
  /** BZN|IT-North-FR */
  "10Y1001A1001A81J": "BZN|IT-North-FR",
  /** BZN|DE-LU, IPA|DE-LU, SCA|DE-LU, MBA|DE-LU */
  "10Y1001A1001A82H": "BZN|DE-LU, IPA|DE-LU, SCA|DE-LU, MBA|DE-LU",
  /** Germany (DE) */
  "10Y1001A1001A83F": "Germany (DE)",
  /** MBA|IT-MACRZONENORTH, SCA|IT-MACRZONENORTH */
  "10Y1001A1001A84D": "MBA|IT-MACRZONENORTH, SCA|IT-MACRZONENORTH",
  /** SCA|IT-MACRZONESOUTH, MBA|IT-MACRZONESOUTH */
  "10Y1001A1001A85B": "SCA|IT-MACRZONESOUTH, MBA|IT-MACRZONESOUTH",
  /** SCA|UA-DobTPP, BZN|UA-DobTPP, CTA|UA-DobTPP */
  "10Y1001A1001A869": "SCA|UA-DobTPP, BZN|UA-DobTPP, CTA|UA-DobTPP",
  /** BZN|IT-Malta */
  "10Y1001A1001A877": "BZN|IT-Malta",
  /** BZN|IT-SACOAC */
  "10Y1001A1001A885": "BZN|IT-SACOAC",
  /** BZN|IT-SACODC, SCA|IT-SACODC */
  "10Y1001A1001A893": "BZN|IT-SACODC, SCA|IT-SACODC",
  /** SNA|Nordic, REG|Nordic, LFB|Nordic */
  "10Y1001A1001A91G": "SNA|Nordic, REG|Nordic, LFB|Nordic",
  /** United Kingdom (UK) */
  "10Y1001A1001A92E": "United Kingdom (UK)",
  /** Malta (MT), BZN|MT, CTA|MT, SCA|MT, MBA|MT */
  "10Y1001A1001A93C": "Malta (MT), BZN|MT, CTA|MT, SCA|MT, MBA|MT",
  /** MBA|MD, SCA|MD, CTA|MD, BZN|MD, Moldova (MD) */
  "10Y1001A1001A990": "MBA|MD, SCA|MD, CTA|MD, BZN|MD, Moldova (MD)",
  /** Armenia (AM), BZN|AM, CTA|AM */
  "10Y1001A1001B004": "Armenia (AM), BZN|AM, CTA|AM",
  /** CTA|GE, BZN|GE, Georgia (GE), SCA|GE, MBA|GE */
  "10Y1001A1001B012": "CTA|GE, BZN|GE, Georgia (GE), SCA|GE, MBA|GE",
  /** Azerbaijan (AZ), BZN|AZ, CTA|AZ */
  "10Y1001A1001B05V": "Azerbaijan (AZ), BZN|AZ, CTA|AZ",
  /** BZN|UA, Ukraine (UA), MBA|UA, SCA|UA */
  "10Y1001C--00003F": "BZN|UA, Ukraine (UA), MBA|UA, SCA|UA",
  /** SCA|UA-IPS, MBA|UA-IPS, BZN|UA-IPS, CTA|UA-IPS */
  "10Y1001C--000182": "SCA|UA-IPS, MBA|UA-IPS, BZN|UA-IPS, CTA|UA-IPS",
  /** BZA|CZ-DE-SK-LT-SE4 */
  "10Y1001C--00038X": "BZA|CZ-DE-SK-LT-SE4",
  /** REG|CORE */
  "10Y1001C--00059P": "REG|CORE",
  /** REG|AFRR, SCA|AFRR */
  "10Y1001C--00090V": "REG|AFRR, SCA|AFRR",
  /** REG|SWE */
  "10Y1001C--00095L": "REG|SWE",
  /** SCA|IT-Calabria, MBA|IT-Z-Calabria, BZN|IT-Calabria */
  "10Y1001C--00096J": "SCA|IT-Calabria, MBA|IT-Z-Calabria, BZN|IT-Calabria",
  /** BZN|GB(IFA) */
  "10Y1001C--00098F": "BZN|GB(IFA)",
  /** BZN|XK, CTA|XK, Kosovo (XK), MBA|XK, LFB|XK, LFA|XK */
  "10Y1001C--00100H": "BZN|XK, CTA|XK, Kosovo (XK), MBA|XK, LFB|XK, LFA|XK",
  /** SCA|IN */
  "10Y1001C--00119X": "SCA|IN",
  /** BZN|NO2A */
  "10Y1001C--001219": "BZN|NO2A",
  /** REG|ITALYNORTH */
  "10Y1001C--00137V": "REG|ITALYNORTH",
  /** REG|GRIT */
  "10Y1001C--00138T": "REG|GRIT",
  /** LFB|AL, LFA|AL, BZN|AL, CTA|AL, Albania (AL), SCA|AL, MBA|AL */
  "10YAL-KESH-----5": "LFB|AL, LFA|AL, BZN|AL, CTA|AL, Albania (AL), SCA|AL, MBA|AL",
  /** MBA|AT, SCA|AT, Austria (AT), IPA|AT, CTA|AT, BZN|AT, LFA|AT, LFB|AT */
  "10YAT-APG------L": "MBA|AT, SCA|AT, Austria (AT), IPA|AT, CTA|AT, BZN|AT, LFA|AT, LFB|AT",
  /** LFA|BA, BZN|BA, CTA|BA, Bosnia and Herz. (BA), SCA|BA, MBA|BA */
  "10YBA-JPCC-----D": "LFA|BA, BZN|BA, CTA|BA, Bosnia and Herz. (BA), SCA|BA, MBA|BA",
  /** MBA|BE, SCA|BE, Belgium (BE), CTA|BE, BZN|BE, LFA|BE, LFB|BE */
  "10YBE----------2": "MBA|BE, SCA|BE, Belgium (BE), CTA|BE, BZN|BE, LFA|BE, LFB|BE",
  /** LFB|BG, LFA|BG, BZN|BG, CTA|BG, Bulgaria (BG), SCA|BG, MBA|BG */
  "10YCA-BULGARIA-R": "LFB|BG, LFA|BG, BZN|BG, CTA|BG, Bulgaria (BG), SCA|BG, MBA|BG",
  /** SCA|DE_DK1_LU, LFB|DE_DK1_LU */
  "10YCB-GERMANY--8": "SCA|DE_DK1_LU, LFB|DE_DK1_LU",
  /** LFB|RS_MK_ME */
  "10YCB-JIEL-----9": "LFB|RS_MK_ME",
  /** LFB|PL */
  "10YCB-POLAND---Z": "LFB|PL",
  /** LFB|SI_HR_BA */
  "10YCB-SI-HR-BA-3": "LFB|SI_HR_BA",
  /** LFB|CH, LFA|CH, SCA|CH, MBA|CH, Switzerland (CH), CTA|CH, BZN|CH */
  "10YCH-SWISSGRIDZ": "LFB|CH, LFA|CH, SCA|CH, MBA|CH, Switzerland (CH), CTA|CH, BZN|CH",
  /** BZN|ME, CTA|ME, Montenegro (ME), MBA|ME, SCA|ME, LFA|ME */
  "10YCS-CG-TSO---S": "BZN|ME, CTA|ME, Montenegro (ME), MBA|ME, SCA|ME, LFA|ME",
  /** LFA|RS, SCA|RS, MBA|RS, Serbia (RS), CTA|RS, BZN|RS */
  "10YCS-SERBIATSOV": "LFA|RS, SCA|RS, MBA|RS, Serbia (RS), CTA|RS, BZN|RS",
  /** BZN|CY, CTA|CY, Cyprus (CY), MBA|CY, SCA|CY */
  "10YCY-1001A0003J": "BZN|CY, CTA|CY, Cyprus (CY), MBA|CY, SCA|CY",
  /** SCA|CZ, MBA|CZ, Czech Republic (CZ), CTA|CZ, BZN|CZ, LFA|CZ, LFB|CZ */
  "10YCZ-CEPS-----N": "SCA|CZ, MBA|CZ, Czech Republic (CZ), CTA|CZ, BZN|CZ, LFA|CZ, LFB|CZ",
  /** LFA|DE(TransnetBW), CTA|DE(TransnetBW), SCA|DE(TransnetBW) */
  "10YDE-ENBW-----N": "LFA|DE(TransnetBW), CTA|DE(TransnetBW), SCA|DE(TransnetBW)",
  /** SCA|DE(TenneT GER), CTA|DE(TenneT GER), LFA|DE(TenneT GER) */
  "10YDE-EON------1": "SCA|DE(TenneT GER), CTA|DE(TenneT GER), LFA|DE(TenneT GER)",
  /** LFA|DE(Amprion), CTA|DE(Amprion), SCA|DE(Amprion) */
  "10YDE-RWENET---I": "LFA|DE(Amprion), CTA|DE(Amprion), SCA|DE(Amprion)",
  /** SCA|DE(50Hertz), CTA|DE(50Hertz), LFA|DE(50Hertz), BZA|DE(50HzT) */
  "10YDE-VE-------2": "SCA|DE(50Hertz), CTA|DE(50Hertz), LFA|DE(50Hertz), BZA|DE(50HzT)",
  /** BZN|DK1A */
  "10YDK-1-------AA": "BZN|DK1A",
  /** IPA|DK1, IBA|DK1, BZN|DK1, SCA|DK1, MBA|DK1, LFA|DK1 */
  "10YDK-1--------W": "IPA|DK1, IBA|DK1, BZN|DK1, SCA|DK1, MBA|DK1, LFA|DK1",
  /** LFA|DK2, MBA|DK2, SCA|DK2, IBA|DK2, IPA|DK2, BZN|DK2 */
  "10YDK-2--------M": "LFA|DK2, MBA|DK2, SCA|DK2, IBA|DK2, IPA|DK2, BZN|DK2",
  /** CTA|PL-CZ, BZA|PL-CZ */
  "10YDOM-1001A082L": "CTA|PL-CZ, BZA|PL-CZ",
  /** BZA|CZ-DE-SK, BZN|CZ+DE+SK */
  "10YDOM-CZ-DE-SKK": "BZA|CZ-DE-SK, BZN|CZ+DE+SK",
  /** BZA|LT-SE4 */
  "10YDOM-PL-SE-LT2": "BZA|LT-SE4",
  /** REG|CWE */
  "10YDOM-REGION-1V": "REG|CWE",
  /** LFB|ES, LFA|ES, BZN|ES, Spain (ES), CTA|ES, SCA|ES, MBA|ES */
  "10YES-REE------0": "LFB|ES, LFA|ES, BZN|ES, Spain (ES), CTA|ES, SCA|ES, MBA|ES",
  /** SNA|Continental Europe */
  "10YEU-CONT-SYNC0": "SNA|Continental Europe",
  /** MBA|FI, SCA|FI, CTA|FI, Finland (FI), BZN|FI, IPA|FI, IBA|FI */
  "10YFI-1--------U": "MBA|FI, SCA|FI, CTA|FI, Finland (FI), BZN|FI, IPA|FI, IBA|FI",
  /** BZN|FR, France (FR), CTA|FR, SCA|FR, MBA|FR, LFB|FR, LFA|FR */
  "10YFR-RTE------C": "BZN|FR, France (FR), CTA|FR, SCA|FR, MBA|FR, LFB|FR, LFA|FR",
  /** LFA|GB, LFB|GB, SNA|GB, MBA|GB, SCA|GB, CTA|National Grid, BZN|GB */
  "10YGB----------A": "LFA|GB, LFB|GB, SNA|GB, MBA|GB, SCA|GB, CTA|National Grid, BZN|GB",
  /** BZN|GR, Greece (GR), CTA|GR, SCA|GR, MBA|GR, LFB|GR, LFA|GR */
  "10YGR-HTSO-----Y": "BZN|GR, Greece (GR), CTA|GR, SCA|GR, MBA|GR, LFB|GR, LFA|GR",
  /** LFA|HR, MBA|HR, SCA|HR, CTA|HR, Croatia (HR), BZN|HR */
  "10YHR-HEP------M": "LFA|HR, MBA|HR, SCA|HR, CTA|HR, Croatia (HR), BZN|HR",
  /** BZN|HU, Hungary (HU), CTA|HU, SCA|HU, MBA|HU, LFA|HU, LFB|HU */
  "10YHU-MAVIR----U": "BZN|HU, Hungary (HU), CTA|HU, SCA|HU, MBA|HU, LFA|HU, LFB|HU",
  /** MBA|SEM(EirGrid), SCA|IE, CTA|IE, Ireland (IE) */
  "10YIE-1001A00010": "MBA|SEM(EirGrid), SCA|IE, CTA|IE, Ireland (IE)",
  /** Italy (IT), CTA|IT, SCA|IT, MBA|IT, LFB|IT, LFA|IT */
  "10YIT-GRTN-----B": "Italy (IT), CTA|IT, SCA|IT, MBA|IT, LFB|IT, LFA|IT",
  /** MBA|LT, SCA|LT, CTA|LT, Lithuania (LT), BZN|LT */
  "10YLT-1001A0008Q": "MBA|LT, SCA|LT, CTA|LT, Lithuania (LT), BZN|LT",
  /** Luxembourg (LU), CTA|LU */
  "10YLU-CEGEDEL-NQ": "Luxembourg (LU), CTA|LU",
  /** CTA|LV, Latvia (LV), BZN|LV, SCA|LV, MBA|LV */
  "10YLV-1001A00074": "CTA|LV, Latvia (LV), BZN|LV, SCA|LV, MBA|LV",
  /** MBA|MK, SCA|MK, BZN|MK, North Macedonia (MK), CTA|MK, LFA|MK */
  "10YMK-MEPSO----8": "MBA|MK, SCA|MK, BZN|MK, North Macedonia (MK), CTA|MK, LFA|MK",
  /** LFA|NL, LFB|NL, CTA|NL, Netherlands (NL), BZN|NL, SCA|NL, MBA|NL */
  "10YNL----------L": "LFA|NL, LFB|NL, CTA|NL, Netherlands (NL), BZN|NL, SCA|NL, MBA|NL",
  /** MBA|NO, SCA|NO, Norway (NO), CTA|NO */
  "10YNO-0--------C": "MBA|NO, SCA|NO, Norway (NO), CTA|NO",
  /** BZN|NO1, IBA|NO1, IPA|NO1, SCA|NO1, MBA|NO1 */
  "10YNO-1--------2": "BZN|NO1, IBA|NO1, IPA|NO1, SCA|NO1, MBA|NO1",
  /** MBA|NO2, SCA|NO2, IPA|NO2, IBA|NO2, BZN|NO2 */
  "10YNO-2--------T": "MBA|NO2, SCA|NO2, IPA|NO2, IBA|NO2, BZN|NO2",
  /** BZN|NO3, IBA|NO3, IPA|NO3, SCA|NO3, MBA|NO3 */
  "10YNO-3--------J": "BZN|NO3, IBA|NO3, IPA|NO3, SCA|NO3, MBA|NO3",
  /** MBA|NO4, SCA|NO4, IPA|NO4, IBA|NO4, BZN|NO4 */
  "10YNO-4--------9": "MBA|NO4, SCA|NO4, IPA|NO4, IBA|NO4, BZN|NO4",
  /** BZN|PL, Poland (PL), CTA|PL, SCA|PL, MBA|PL, BZA|PL, LFA|PL */
  "10YPL-AREA-----S": "BZN|PL, Poland (PL), CTA|PL, SCA|PL, MBA|PL, BZA|PL, LFA|PL",
  /** LFA|PT, LFB|PT, MBA|PT, SCA|PT, CTA|PT, Portugal (PT), BZN|PT */
  "10YPT-REN------W": "LFA|PT, LFB|PT, MBA|PT, SCA|PT, CTA|PT, Portugal (PT), BZN|PT",
  /** BZN|RO, Romania (RO), CTA|RO, SCA|RO, MBA|RO, LFB|RO, LFA|RO */
  "10YRO-TEL------P": "BZN|RO, Romania (RO), CTA|RO, SCA|RO, MBA|RO, LFB|RO, LFA|RO",
  /** MBA|SE, SCA|SE, CTA|SE, Sweden (SE) */
  "10YSE-1--------K": "MBA|SE, SCA|SE, CTA|SE, Sweden (SE)",
  /** Slovenia (SI), BZN|SI, CTA|SI, SCA|SI, MBA|SI, LFA|SI */
  "10YSI-ELES-----O": "Slovenia (SI), BZN|SI, CTA|SI, SCA|SI, MBA|SI, LFA|SI",
  /** LFA|SK, LFB|SK, MBA|SK, SCA|SK, CTA|SK, BZN|SK, Slovakia (SK) */
  "10YSK-SEPS-----K": "LFA|SK, LFB|SK, MBA|SK, SCA|SK, CTA|SK, BZN|SK, Slovakia (SK)",
  /** Turkey (TR), BZN|TR, CTA|TR, SCA|TR, MBA|TR, LFB|TR, LFA|TR */
  "10YTR-TEIAS----W": "Turkey (TR), BZN|TR, CTA|TR, SCA|TR, MBA|TR, LFB|TR, LFA|TR",
  /** LFA|UA-BEI, LFB|UA-BEI, MBA|UA-BEI, SCA|UA-BEI, CTA|UA-BEI, BZN|UA-BEI */
  "10YUA-WEPS-----0": "LFA|UA-BEI, LFB|UA-BEI, MBA|UA-BEI, SCA|UA-BEI, CTA|UA-BEI, BZN|UA-BEI",
  /** BZN|GB(ElecLink) */
  "11Y0-0000-0265-K": "BZN|GB(ElecLink)",
  /** BZN|GB(IFA2) */
  "17Y0000009369493": "BZN|GB(IFA2)",
  /** BZN|DK1-NO1 */
  "46Y000000000007M": "BZN|DK1-NO1",
  /** BZN|NO2NSL */
  "50Y0JVU59B4JWQCU": "BZN|NO2NSL",
  /** Belarus (BY) */
  "BY": "Belarus (BY)",
  /** Russia (RU) */
  "RU": "Russia (RU)",
  /** Iceland (IS) */
  "IS": "Iceland (IS)",
};

/**
 * Helper function to find all areas having a specific identier
 *
 * Example, to find all ids for bidding zone SE4, pass identifier SE4
 *
 * @public
 *
 * @param identifier - identifier/descriptor of the area of interest, example: SE4
 *
 * @returns - Undefined, or array containing matching ids of the area of interest, example ["10Y1001A1001A47J","10Y1001C--00038X"]
 */
const AllAreas = (identifier: string): string[] | undefined => {
  return Object.entries(Areas).filter(([_key, value]) => value.includes(identifier)).map((e) => e[0]);
};

/**
 * Helper function to find first area having a specific identier
 *
 * Example, to find first id matching bidding zone SE4, pass identifier BZN|SE4
 *
 * Where
 *    BZN — Bidding Zone
 *    BZA — Bidding Zone Aggregation
 *    CA — Control Area
 *    MBA — Market Balance Area
 *    IBA — Imbalance Area
 *    IPA — Imbalance Price Area
 *    LFA — Load Frequency Control Area
 *    LFB — Load Frequency Control Block
 *    REG — Region
 *    SCA — Scheduling Area
 *    SNA — Synchronous Area
 *
 * @public
 * @category Helpers
 *
 * @param identifier - identifier/descriptor of the area of interest, example: BZN|SE4
 *
 * @returns - Id of the area of interest, example "10Y1001A1001A47J", or undefined
 */
const Area = (identifier: string): string | undefined => {
  return AllAreas(identifier)?.[0];
};

export { AllAreas, Area, Areas };
