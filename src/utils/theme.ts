type Theme = "light" | "dark";

export const applyTheme = (theme: Theme): void => {
	document.documentElement.classList.remove("dark", "light");
	document.documentElement.classList.add(theme);
	document.documentElement.setAttribute("data-theme", theme);

	try {
		localStorage.setItem("theme", theme);
	} catch {
		// localStorage not available
	}
};
