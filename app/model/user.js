// 26 safe colors for each alphabetical letter
const SAFE_COLORS = ["#003366", "#0066cc", "#00cc00", "#3399cc", "#3300cc", "#336600", "#339966", "#33cccc", "#660000", "#663366", "#6666cc", "#66cc00", "#66cc99", "#9900cc", "#996600", "#999966", "#99cccc", "#cc0000", "#cc3366", "#cc66cc", "#cccc00", "#ccff66", "#ff00cc", "#ff6600", "#ff9966", "#ffcccc"] ;

class User {
	constructor(name, id) {
		User.COUNT++;
		this.name = name;
		this.color = SAFE_COLORS[name[0].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)];
		this.id = id;
	}

	toJson() {
		const { id, name, color } = this;
		return { id, name, color };
	}
}

User.COUNT = 0;

export default User;