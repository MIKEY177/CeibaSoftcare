export const getColorFromName = (name) => {
      const pastelColors = [
        { bg: "#FFCDD2", fg: "#B71C1C" },
        { bg: "#F8BBD0", fg: "#880E4F" },
        { bg: "#E1BEE7", fg: "#4A148C" },
        { bg: "#D1C4E9", fg: "#311B92" },
        { bg: "#C5CAE9", fg: "#1A237E" },
        { bg: "#BBDEFB", fg: "#0D47A1" },
        { bg: "#B3E5FC", fg: "#01579B" },
        { bg: "#B2EBF2", fg: "#006064" },
        { bg: "#B2DFDB", fg: "#004D40" },
        { bg: "#C8E6C9", fg: "#1B5E20" },

        { bg: "#DCEDC8", fg: "#33691E" },
        { bg: "#F0F4C3", fg: "#827717" },
        { bg: "#FFF9C4", fg: "#F57F17" },
        { bg: "#FFECB3", fg: "#FF6F00" },
        { bg: "#FFE0B2", fg: "#E65100" },
        { bg: "#FFCCBC", fg: "#BF360C" },
        { bg: "#D7CCC8", fg: "#3E2723" },
        { bg: "#CFD8DC", fg: "#263238" },
        { bg: "#F5F5F5", fg: "#424242" },
        { bg: "#ECEFF1", fg: "#37474F" },

        { bg: "#FDE2E4", fg: "#9D0208" },
        { bg: "#FAD2E1", fg: "#A4133C" },
        { bg: "#E2ECE9", fg: "#344E41" },
        { bg: "#D8E2DC", fg: "#3A5A40" },
        { bg: "#FFE5D9", fg: "#9C6644" },
        { bg: "#FFD7BA", fg: "#BC6C25" },
        { bg: "#FEC89A", fg: "#9A3412" },
        { bg: "#FAE1DD", fg: "#6D6875" },
        { bg: "#E8E8E4", fg: "#414833" },
        { bg: "#DDBEA9", fg: "#7F5539" },

        { bg: "#A9DEF9", fg: "#003049" },
        { bg: "#E4C1F9", fg: "#5A189A" },
        { bg: "#F694C1", fg: "#9D174D" },
        { bg: "#D0F4DE", fg: "#1B4332" },
        { bg: "#FCF6BD", fg: "#9381FF" },
        { bg: "#FFC6FF", fg: "#7209B7" },
        { bg: "#CDEAC0", fg: "#386641" },
        { bg: "#B5EAD7", fg: "#006D77" },
        { bg: "#FFDAC1", fg: "#9A031E" },
        { bg: "#E2F0CB", fg: "#4F772D" },

        { bg: "#C7CEEA", fg: "#3A0CA3" },
        { bg: "#FFB7B2", fg: "#C1121F" },
        { bg: "#B5EAD7", fg: "#2D6A4F" },
        { bg: "#FFDFD3", fg: "#9C6644" },
        { bg: "#E0BBE4", fg: "#6A1B9A" },
        { bg: "#D4F0F0", fg: "#005F73" },
        { bg: "#F1C0E8", fg: "#7B2CBF" },
        { bg: "#CFBAF0", fg: "#5A189A" },
        { bg: "#A0C4FF", fg: "#1D3557" },
        { bg: "#FDFFB6", fg: "#6A994E" },
      ];

      let hash = 0;
      const safeName = name || "Usuario"; // Usar un nombre seguro si no se proporciona
      for (let i = 0; i < safeName.length; i++) {
        hash += safeName.charCodeAt(i);
      }

      return pastelColors[hash % pastelColors.length];
};