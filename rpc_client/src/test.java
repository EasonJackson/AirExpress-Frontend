import java.util.Date;

public class test {
	public static int Print() {
		Date d = new Date();
		return d.hashCode();
	}

	public static String processRequest(String method, String[] params) {
		return "{" + "\"method\" : " + "\"" + method + "\"}";
	}
}