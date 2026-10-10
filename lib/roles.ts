export const ROLES = ["admin", "saleperson", "manager", "assistant", "accountant"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_HOME = {
	admin: "/admin/dashboard",
	saleperson: "/saleperson/dashboard",
	manager: "/manager/dashboard",
	assistant: "/assistant/dashboard",
	accountant: "/accountant/dashboard",
} satisfies Record<Role, string>;

export function isRole(value: unknown): value is Role {
	return (
		typeof value === "string" &&
		(ROLES as readonly string[]).includes(value)
	);
}
