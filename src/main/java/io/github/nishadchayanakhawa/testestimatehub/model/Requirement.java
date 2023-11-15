package io.github.nishadchayanakhawa.testestimatehub.model;

//jpa
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
//jpa validations
import jakarta.validation.constraints.NotBlank;
//lombok
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
//java utils


/**
 * <b>Class Name</b>: Requirement<br>
 * <b>Description</b>: Requirement entity.<br>
 * 
 * @author nishad.chayanakhawa
 */
@Entity
@Table(name = "TEH_REQUIREMENT", uniqueConstraints = {
		@UniqueConstraint(name = "TEH_UNIQUE_REQUIREMENT_PER_CHANGE", columnNames = { "OWNER_CHANGE_ID",
				"IDENTIFIER" }) })
@Getter
@Setter
@NoArgsConstructor
public class Requirement {
	// change
	@Column(name = "OWNER_CHANGE_ID")
	private Long changeId;

	// id
	@Id
	@GeneratedValue
	@Column(name = "REQUIREMENT_ID")
	private Long id;

	// identifier
	@Column(nullable = false)
	@NotBlank(message = "identifier {required.message}")
	private String identifier;

	// summary
	@Column(nullable = false)
	@NotBlank(message = "summary {required.message}")
	private String summary;
}